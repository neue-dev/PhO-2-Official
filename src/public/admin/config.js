
const CONFIG = (() => {

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

  // Modal forms
  const config_form = 
    DOM.stateful_form('config-form')
      .form_field('_id', { type: 'text' })
      .form_field('Value', { type: 'text' })
        .select('.field._id').s({ display: 'none' }).parent()

  const users_form = 
    DOM.stateful_form('users-form')
      .form_field('_id', { type: 'text' })
      .form_field('Username', { type: 'text' })
      .form_field('Password', { type: 'text' })
      .form_field('Status', { type: 'text' })
      .form_field('Category', { type: 'text' })
        .select('.field._id').s({ display: 'none' }).parent()

  const problems_form = 
    DOM.stateful_form('problems-form')
      .form_field('_id', { type: 'text' })
      .form_field('Name', { type: 'text' })
      .form_field('Code', { type: 'text' })
      .form_field('Answer', { type: 'text' })
      .form_field('Tolerance', { type: 'text' })
      .form_field('Type', { type: 'text' })
      .form_field('Status', { type: 'text' })
      .form_field('Points', { type: 'text' })
        .select('.field._id').s({ display: 'none' }).parent()

  // Set up the modals
  config_modal
    .modal_header('Edit Config')
    .modal_append(config_form)

  users_modal
    .modal_header('Edit User')
    .modal_append(users_form)

  problems_modal
    .modal_header('Edit Problem')
    .modal_append(problems_form)

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

  /**
   *  Reusable components and styles
   */

  // Some convenience styles
  const auto_width = { width: 0 };
  const full_width = { width: document.width };

  // Built in components
  const { tr, or, td, label, link, div, span, button, buttons, sup } = C.LIB;

  // Extended components
  const td_auto = 
    C.new(() => td().s(auto_width));
  const td_auto_right = 
    C.new(() => td_auto().c('right', 'aligned'))
  const td_auto_label = 
    C.new(() => td_auto().append(label()))

  // Edit and delete buttons
  const edit_button = 
    C.new(() => button().c('edit-button').t('Edit')) 
  const recheck_button = 
    C.new(() => button().c('recheck-button').t('Recheck'))
  const delete_button = 
    C.new(() => button().c('delete-button', 'negative').t('Delete'))

  // Table edit and delete buttons
  const td_edit_button = 
    C.new(() => td_auto_right().append(buttons().append(edit_button())))

  // Config table mapper
  const config_table_mapper = (parameter) => (
    tr().c('editable-row')
      .listen('click', (e) => config_modal.modal_open())
      .append(
        td_auto_label({ '.label': { t: parameter.key }}),
        td_auto().append(
          parameter.type === 'url'
            ? link().t(parameter.value).ref(parameter.value) : parameter.type === 'date'
            ? span().t(date(parameter.value)) : parameter.type === 'duration'
            ? span().t(parameter.value) 
            : span().t(parameter.value))
      )
  )

  // Problem table mapper
  const problems_table_mapper = (problem) => (
    tr().c('editable-row')
      .listen('click', (e) => problems_modal.modal_open())
      .append(
        td_auto_label({ '.label': { t: problem.code.number + problem.code.alpha }}),
        td_auto().t(problem.name),
        td_auto_label({ 
          '.label': { 
            t: problem.type, c: 'black',
            s: problem.type === 'official' ? { visibility: 'hidden' } : {},
          }
        }),
        td_auto_label({ 
          '.label': { 
            t: problem.status, 
            c: problem.status === 'active' ? [ 'default' ] : [ 'basic', 'orange' ], 
          }
        }),
        td_auto().t(problem.answer.mantissa + ' &times; 10').append(sup().t(problem.answer.exponent)),
        td_auto().t(problem.tolerance)
      )
  )

  // User table mapper
  const users_table_mapper = (user) => (
    tr().c('editable-row')
      .listen('click', (e) => users_modal.modal_open())
      .append(
        td_auto().s(auto_width).t(user.username),
        td_auto_label({
          '.label': {
            t: user.status,
            c: user.status === 'spectating' ? [ 'basic', 'blue' ] : [ 'basic', 'orange' ],
            s: user.status === 'participating' ? { visibility: 'hidden' } : {},
          }
        }),
        td_auto_label({
          '.label': {
            t: user.isAdmin ? 'admin' : user.category,
            c: user.isAdmin ? 'red' : user.category === 'junior' ? 'default': 'black'
          }
        })
      )
  )

  // Set up the tables
  config_table
    .table_header('Parameter', 'Value', '')
    .mapper = config_table_mapper;

  users_table
    .table_header('User', '', '', '')
    .mapper = users_table_mapper;

  problems_table
    .table_header('Problem', '', '', '', 'Answer', 'Tolerance', '')
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