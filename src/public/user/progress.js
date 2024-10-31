
const PROGRESS = (() => {

  // Tabs and tab menu
  const tabs = 
    DOM.stateful_tabs('progress-tabs', DOM.select('.tabs'));
  
  const tabs_menu = 
    DOM.stateful_menu('progress-menu', DOM.select('.tabs-menu'))
      .menu_on_selected(c => tabs.tabs_active_tab(c))
      .menu_selected_item('.problems');

  // Tables, labels and, modals
  const problems_label = DOM.select('.problems-label');
  const problems_table = DOM.stateful_table('problems-table', DOM.select('.problems-table'));
  const problems_modal = DOM.stateful_modal('problems-modal', DOM.select('.problems-modal'))

  const submissions_label = DOM.select('.submissions-label');
  const submissions_table = DOM.stateful_table('submissions-table', DOM.select('.submissions-table'));
  const submissions_modal = DOM.stateful_modal('submissions-modal', DOM.select('.submissions-modal'))

  // Set up the modals
  problems_modal.modal_header('View Problem Details');
  submissions_modal.modal_header('View Submission Details');

  submissions_table.mapper = (data) => DOM.div().t(data);
  problems_table.mapper = (data) => DOM.div().t(data);

  // Search bar
  const search_bar = DOM.select('.search-bar')

  // Filter feature
  search_bar.listen('input', (e) => {

    // Grab the table
    const tab_name = tabs.tabs_active_tab();
    const tab = tabs.select(tab_name);
    const table = tab.select('table')
    const value = e.target.value.toUpperCase();

    // Filter it
    table.table_filter((data, text) =>  
      text
        .toUpperCase()
        .includes(value))

    // Re-render it
    table.table_map(table.mapper);
  });

  // Keybinds 
  DOM.keybind({ ctrlKey: true, keyCode: 'f' }, () => search_bar.focus())

  // Save the submissions
  X.request('./user/submissionlist', 'POST')
    .then(({ submissions }) => PHO2.submissions(submissions))
    .then(() => submissions_label.t(PHO2.submissions().length))
    .then(() => submissions_table.table_data(PHO2.submissions()))
    .then(() => submissions_table.table_map(submissions_table.mapper))

  // Save the problems
  X.request('./user/problemlist', 'POST')
    .then(({ problems }) => PHO2.problems(problems))
    .then(() => problems_label.t(PHO2.problems().length))
    .then(() => problems_table.table_data(PHO2.problems()))
    .then(() => problems_table.table_map(problems_table.mapper))

})()