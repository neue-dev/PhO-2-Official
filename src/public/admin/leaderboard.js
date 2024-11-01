
const LEADERBOARD = (() => {

  /**
   *  Reusable components and styles
   */

  // Some convenience styles
  const auto_width = { width: 0 };
  const full_width = { width: document.width };

  // Built in components
  const { tr, td, th, label, link, span, button, icon } = C.LIB;

  // Extended components
  const tr_hoverable = 
    C.new(() => tr().c('hoverable-row'));
  const td_auto = 
    C.new(() => td().s(auto_width));
  const td_auto_right = 
    C.new(() => td_auto().c('right', 'aligned'))
  const td_auto_label = 
    C.new(() => td_auto().append(label()))

  // Edit and delete buttons
  const new_button = 
    C.new(() => button().c('new-button', 'blue', 'right', 'labeled', 'icon').t('new')
      .append(icon().c('plus')))

  // Tabs and tab menu
  const tabs = 
    DOM.stateful_tabs('leaderboard-tabs', DOM.select('.tabs'));
    
  const tabs_menu = 
    DOM.stateful_menu('leaderboard-menu', DOM.select('.tabs-menu'))
      .menu_on_selected(c => tabs.tabs_active_tab(c))
      .menu_selected_item('.all');

  // Labels and Tables
  const all_label = DOM.select('.all-label');
  const all_table = DOM.stateful_table('all-table', DOM.select('.all-table'));

  const junior_label = DOM.select('.junior-label');
  const junior_table = DOM.stateful_table('junior-table', DOM.select('.junior-table'));
  
  const senior_label = DOM.select('.senior-label');
  const senior_table = DOM.stateful_table('senior-table', DOM.select('.senior-table'));

  // Search bar
  const search_bar = DOM.select('.search-bar')

  // Filter feature
  search_bar.listen('input', (e) => {

    // Grab the table
    const tab_name = tabs.tabs_active_tab();
    const tab = tabs.select(tab_name);
    const table = tab.select('table')
    const value = e.target.value.toUpperCase();

    // Filter and sort it
    table.table_filter((data, text) =>  
      text
        .toUpperCase()
        .includes(value))
    table.table_sort(table.comparator);

    // Re-render it
    table.table_map(table.mapper);
  });

  // Keybinds 
  DOM.keybind({ ctrlKey: true, keyCode: 'f' }, () => search_bar.focus())

  // Comparators
  const leaderboard_table_comparator = (a, b) => 
    a.rank - b.rank || a.username.localeCompare(b.username)
    
  // Config table mapper factory
  const leaderboard_table_mapper_factory = (cat) => (
    (score) => (
      (cat === 'all' || cat === score.category) 
        ? tr_hoverable()
          .append(
            td_auto_label({ '.label': { t: cat === 'all' ? score.rank : score.cat_rank }}),
            td_auto().append(score.username),
            td_auto_label({ '.label': { 
              t: score.category,
              c: score.category === 'junior' ? 'default' : 'black',  
            }}),
            td_auto_label({ '.label': { t: score.score }}),
            td_auto()
          )
        : tr_hoverable()
    )
  )

  // Set up the tables
  all_table.table_header('', 'Team', '', 'Score', '')
  junior_table.table_header('', 'Team', '', 'Score', '')
  senior_table.table_header('', 'Team', '', 'Score', '')

  // Mappers and comparators
  all_table.mapper = leaderboard_table_mapper_factory('all')
  all_table.comparator = leaderboard_table_comparator
  junior_table.mapper = leaderboard_table_mapper_factory('junior')
  junior_table.comparator = leaderboard_table_comparator
  senior_table.mapper = leaderboard_table_mapper_factory('senior')
  senior_table.comparator = leaderboard_table_comparator

  // Save the scores
  function load_scores() {
    X.request('./user/scorelist', 'POST')
      .then(({ scores }) => PHO2.scores(scores))
      .then(() => all_label.t(PHO2.scores().length))
      .then(() => all_table.table_data(PHO2.scores()))
      .then(() => all_table.table_sort(all_table.comparator))
      .then(() => all_table.table_map(all_table.mapper))

      .then(() => junior_label.t(PHO2.scores().filter(score => score.category === 'junior').length))
      .then(() => junior_table.table_data(PHO2.scores()))
      .then(() => junior_table.table_sort(junior_table.comparator))
      .then(() => junior_table.table_map(junior_table.mapper))

      .then(() => senior_label.t(PHO2.scores().filter(score => score.category === 'senior').length))
      .then(() => senior_table.table_data(PHO2.scores()))
      .then(() => senior_table.table_sort(senior_table.comparator))
      .then(() => senior_table.table_map(senior_table.mapper))
  }

  load_scores();
})()