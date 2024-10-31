
const CONFIG = (() => {

  // Tabs and tab menu
  const tabs = 
    DOM.stateful_tabs('config-tabs', DOM.select('.tabs'));
    
  const tabs_menu = 
    DOM.stateful_menu('config-menu', DOM.select('.tabs-menu'))
      .menu_on_selected(c => tabs.tabs_active_tab(c))
      .menu_selected_item('.config');

  // Labels, Tables and Modals
  const config_label = DOM.select('.config-label');
  const config_table = DOM.stateful_table('config-table', DOM.select('.config-table'));
  const config_modal = DOM.stateful_modal('config-modal', DOM.select('.config-modal'))

  const users_label = DOM.select('.users-label');
  const users_table = DOM.stateful_table('users-table', DOM.select('.users-table'));
  const users_modal = DOM.stateful_modal('users-modal', DOM.select('.users-modal'))
  
  const problems_label = DOM.select('.problems-label');
  const problems_table = DOM.stateful_table('problems-table', DOM.select('.problems-table'));
  const problems_modal = DOM.stateful_modal('problems-modal', DOM.select('.problems-modal'))

  // Set up the modals
  config_modal.modal_header('Edit Config');
  users_modal.modal_header('Edit User');
  problems_modal.modal_header('Edit Problem');

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

  // ! <!-- ! move elsewhere  -->
  const date = (timestamp) => {
    
    const date = new Date(timestamp * 1)
    const date_options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return `${date.toISOString().substring(11, 16)} 
      ${date.toLocaleDateString(undefined, date_options)}`;
  }

  /**
   *  Reusable components and styles
   */

  // Some convenience styles
  const auto_width = { width: 0 };
  const full_width = { width: document.width };

  // Row and data
  const tr = () => DOM.tr();
  const td = () => DOM.td().s(auto_width);

  // Label
  const td_label = () =>
    DOM.td().s(auto_width).append(
      DOM.label())
    
  // Edit button
  const edit_button = () => 
    DOM.td().s(auto_width).c('right', 'aligned').append(
      DOM.buttons().append(DOM.button().t('Edit')))

  // Edit delete button
  const edit_delete_button = () => 
    DOM.td().s(auto_width).c('right', 'aligned').append(
      DOM.buttons().append(
        DOM.button().t('Edit'),
        DOM.or(),
        DOM.button().t('Delete').c('negative')))

  // Config table mapper
  const config_table_mapper = (parameter) => (
    tr().append(
      td_label().select(0).t(parameter.key).parent(),
      td().append(
        parameter.type == 'url'
          ? DOM.link().t(parameter.value).ref(parameter.value) : parameter.type == 'date'
          ? DOM.span().t(date(parameter.value)) : parameter.type == 'duration'
          ? DOM.span().t(parameter.value) 
          : DOM.span().t(parameter.value)),
      edit_button()
        .listen('click', (e) => config_modal.modal_open()))
  )

  // Problem table mapper
  const problems_table_mapper = (problem) => (
    tr().append(
      td_label().select(0).t(problem.code.number + problem.code.alpha).parent(),
      td().t(problem.name),
      td().t(problem.answer.mantissa + ' &times; 10').append(
        DOM.sup().t(problem.answer.exponent)),
      td().t(problem.tolerance),
      edit_delete_button()
        .listen('click', (e) => problems_modal.modal_open()))
  )

  // User table mapper
  const users_table_mapper = (user) => (
    tr().append(
      td().s(auto_width).t(user.username),
      td().s(auto_width).append(
        user.isAdmin 
          ? DOM.label().c('red').t('admin')
          : DOM.label().t(user.category).c(
            user.category == 'junior' 
              ? 'default'
              : 'black'
          )),
      td_label().select(0).t(user.status)
        .c(user.status == 'spectating' 
          ? 'blue' : user.status == 'disqualified' 
          ? 'orange'
          : 'default')
        .c(user.status == 'participating' 
          ? 'default' 
          : 'basic').parent(),
      edit_delete_button()
        .listen('click', (e) => users_modal.modal_open()))
  )

  // Set up the tables
  config_table
    .table_header('Parameter', 'Value', '')
    .mapper = config_table_mapper;

  users_table
    .table_header('User', 'Category', 'Status', '')
    .mapper = users_table_mapper;

  problems_table
    .table_header('Code', 'Problem', 'Answer', 'Tolerance', '')
    .mapper = problems_table_mapper;

  // Save the config
  X.request('./admin/configlist', 'POST')
    .then(({ config }) => PHO2.config(config))
    .then(() => config_label.t(PHO2.config().length))
    .then(() => config_table.table_data(PHO2.config()))
    .then(() => config_table.table_map(config_table.mapper))

  // Save the users
  X.request('./admin/userlist', 'POST')
    .then(({ users }) => PHO2.users(users))
    .then(() => users_label.t(PHO2.users().length))
    .then(() => users_table.table_data(PHO2.users()))
    .then(() => users_table.table_map(users_table.mapper))

  // Save the problems
  X.request('./admin/problemlist', 'POST')
    .then(({ problems }) => PHO2.problems(problems))
    .then(() => problems_label.t(PHO2.problems().length))
    .then(() => problems_table.table_data(PHO2.problems()))
    .then(() => problems_table.table_map(problems_table.mapper))
})()