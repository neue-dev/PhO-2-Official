
const CONFIG = (() => {

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
    C.new(() => tr().c('hoverable-row').tooltip({ text: 'Click to edit.' }));
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
    DOM.stateful_tabs('config-tabs', DOM.select('.tabs'));
  
  // Inits the menu tabs, DO NOT REMOVE
  const tabs_menu = 
    DOM.stateful_menu(DOM.select('.tabs-menu'))
      .menu_on_selected(c => tabs.tabs_active_tab(c))
      .menu_selected_item('.config');

  // Labels, Tables and Modals
  const config_label = DOM.select('.config-label');
  const config_table = DOM.stateful_table(DOM.select('.config-table'));
  const config_modal = DOM.stateful_modal(DOM.select('.config-modal'));

  const users_label = DOM.select('.users-label');
  const users_table = DOM.stateful_table(DOM.select('.users-table'));
  const users_modal = DOM.stateful_modal(DOM.select('.users-modal'));
  
  const problems_label = DOM.select('.problems-label');
  const problems_table = DOM.stateful_table(DOM.select('.problems-table'));
  const problems_modal = DOM.stateful_modal(DOM.select('.problems-modal'));

  // Global buttons
  const users_new = new_button();
  const problems_new = new_button();

  // Modal forms
  const config_form = DOM.stateful_form()
    .form_field('_id', { type: 'text' })
    .form_field('Key', { type: 'text' })
    .form_field('Value', { type: 'text' }, { mapper: { 'datetime-local': (value) => Time.timestamp_from_datestr(value) } })
    .form_field_hide('_id')  
    .form_field_hide('key')

  const users_form = DOM.stateful_form()
    .form_field('_id', { type: 'text' })
    .form_field('Username', { type: 'text' })
    .form_field('Password', { type: 'text' })
    .form_field('Status', { type: 'select', options: [ 'participating', 'spectating', 'disqualified' ] })
    .form_field('Category', { type: 'select', options: [ 'junior', 'senior' ] })
    .form_field_hide('_id')

  const problems_form = DOM.stateful_form()
    .form_field('_id', { type: 'text' })
    .form_field('Name', { key: 'problem-name', type: 'text' })
    .form_field('Code', { key: 'problem-code', type: 'text' }, { 
      checker: Formatter.valid_problem_code, 
      mapper: Formatter.lift_problem_code })
    .form_field('Answer', { type: 'text' }, { 
      checker: Formatter.valid_submission_answer, 
      mapper: Formatter.lift_submission_answer })
    .form_field('Tolerance', { type: 'text' })
    .form_field('Type', { type: 'select', options: [ 'official', 'debug' ] })
    .form_field('Status', { type: 'select', options: [ 'active', 'disabled' ] })
    .form_field('Points', { type: 'text' })
    .form_field_hide('_id')

  const action_apply = (modal, form, target, callback) => (
    modal.modal_action('apply', () => 
      form.form_submit(target)
        .then(({ message }) => DOM.toast({ title: message }))
        .then(() => callback())
        .then(() => modal.modal_close())
        .catch(({ error }) => DOM.toast({ title: error, label: 'error' }))),
    modal.select('.action.apply').c('black')
  )

  const action_cancel = (modal) => (
    modal.modal_action('cancel', () => modal.modal_close()),
    modal.select('.action.cancel').c('red')
  )

  const action_create = (modal, form, target, callback) => (
    modal.modal_action('create', () =>
      form.form_submit(target)
        .then(({ message }) => DOM.toast({ title: message }))
        .then(() => callback())
        .then(() => modal.modal_close())
        .catch(({ error }) => DOM.toast({ title: error, label: 'error' }))),
    modal.select('.action.create').c('blue')
  )

  const action_delete = (modal, form, target, callback) => (
    modal.modal_action('delete', () => 
      form.form_submit(target)
        .then(({ message }) => DOM.toast({ title: message }))
        .then(() => callback())
        .then(() => modal.modal_close())
        .catch(({ error }) => DOM.toast({ title: error, label: 'error' }))),
    modal.select('.action.delete')
      .c('red', 'basic', 'left', 'floated')
  )

  const action_recheck = (modal, form, target, callback) => (
    modal.modal_action('recheck', () => 
      form.form_submit(target)
        .then(({ message }) => DOM.toast({ title: message }))
        .then(() => callback())
        .then(() => modal.modal_close())
        .catch(({ error }) => DOM.toast({ title: error, label: 'error' }))),
    modal.select('.action.recheck')
      .c('orange', 'basic', 'left', 'floated')
  )

  // Modal buttons
  action_delete(users_modal, users_form, './admin/deleteuser', load_users)
  action_delete(problems_modal, problems_form, './admin/deleteproblem', load_problems)

  action_cancel(config_modal)
  action_cancel(users_modal)
  action_cancel(problems_modal)

  action_apply(config_modal, config_form, './admin/editconfig', load_config)
  action_apply(users_modal, users_form, './admin/edituser', load_users)
  action_apply(problems_modal, problems_form, './admin/editproblem', load_problems)

  action_create(users_modal, users_form, './admin/registeruser', load_users)
  action_create(problems_modal, problems_form, './admin/registerproblem', load_problems)
  
  action_recheck(problems_modal, problems_form, './admin/recheckproblem', load_problems)

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

  // Tooltip and filter feature
  search_bar.tooltip({ text: 'Filter the rows of the active table by the search term.', label: 'ctrl + f' })
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

  // Enable and disable buttons
  const enable_official_button = DOM.select('.enable-official-button')
  const disable_official_button = DOM.select('.disable-official-button')
  
  enable_official_button.listen('click', () => (
    X.request('./admin/enableofficial', 'POST')
      .then(({ message }) => DOM.toast({ title: message }))
      .then(load_problems), 
    tabs.tabs_active_tab('.problems'), 
    tabs_menu.menu_selected_item('.problems')))

  disable_official_button.listen('click', () => (
    X.request('./admin/disableofficial', 'POST')
      .then(({ message }) => DOM.toast({ title: message }))
      .then(load_problems), 
    tabs.tabs_active_tab('.problems'), 
    tabs_menu.menu_selected_item('.problems')))

  // Keybinds 
  DOM.keybind({ ctrlKey: true, key: 'f' }, () => search_bar.focus())

  // Add new user or problem
  DOM.keybind({ ctrlKey: true, key: 'u' }, () => (
    tabs.tabs_active_tab() === '.users' && users_new.click(),
    tabs.tabs_active_tab() === '.problems' && problems_new.click()))

  // Close all modals
  DOM.keybind({ key: 'Escape' }, () => 
    (config_modal.modal_close(), problems_modal.modal_close(), users_modal.modal_close()))

  // Handles clicks of config table rows
  const config_table_handler = (parameter) => (
    config_form
      .form_clear()
      .form_field_value('_id', parameter._id)
      .form_field_value('key', parameter.key)
      .form_field_type('value', parameter.type)
      .form_field_value('value', parameter.value),
    
    config_modal
      .modal_header(parameter.key)
      .modal_open()
  )

  // Handles clicks of problem table rows
  const problems_table_handler = (problem) => (
    problems_form
      .form_clear()
      .form_field_value('_id', problem._id)
      .form_field_value('problem-name', problem.name)
      .form_field_value('type', problem.type)
      .form_field_value('status', problem.status)
      .form_field_value('problem-code', problem.code.number + problem.code.alpha)
      .form_field_value('answer', problem.answer.mantissa + 'e' + problem.answer.exponent)
      .form_field_value('tolerance', problem.tolerance)
      .form_field_value('points', problem.points),
    
    problems_modal.modal_header(problem.name)
      .modal_action_hide('create')
      .modal_action_show('delete')
      .modal_action_show('apply')
      .modal_open()
  )

  // Handles clicks of user table rows
  const users_table_handler = (user) => (
    users_form
      .form_clear()
      .form_field_value('_id', user._id)
      .form_field_value('username', user.username)
      .form_field_value('status', user.status)
      .form_field_value('category', user.category)
      .form_field_show('status')
      .select('.field.password').uc('req'),
    
    users_modal
      .modal_header(user.username)
      .modal_action_hide('create')
      .modal_action_show('delete')
      .modal_action_show('apply'),
    
    user.isAdmin 
      ? users_modal.modal_action_hide('delete') 
      : null,
    users_modal.modal_open()
  )

  // Comparators
  const config_table_comparator = (a, b) => 0
  const problems_table_comparator = (a, b) => 
    (parseInt(a.code.number) - parseInt(b.code.number) || (a.code.alpha).localeCompare(b.code.alpha))
  const users_table_comparator = (a, b) => a.username.localeCompare(b.username)
    
  // Config table mapper
  const config_table_mapper = (parameter) => (
    tr_hoverable()
      .listen('click', () => config_table_handler(parameter))
      .append(
        td_auto_label({ '.label': { t: parameter.key }}),
        td_auto().append(
          parameter.type === 'url'
            ? link().t(parameter.value).ref(parameter.value) : parameter.type === 'date'
            ? span().t(Time.timestamp_to_mdy_hms(parameter.value)) : parameter.type === 'duration'
            ? span().t(parameter.value) 
            : span().t(parameter.value))
      )
  )

  // Problem table mapper
  const problems_table_mapper = (problem) => (
    tr_hoverable()
      .listen('click', () => problems_table_handler(problem))
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
        td_auto(),
      )
  )

  // User table mapper
  const users_table_mapper = (user) => (
    tr_hoverable()
      .listen('click', () => users_table_handler(user))
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
        }),
        td_auto()
      )
  )

  // Set up the global buttons
  users_new.tooltip({ text: 'Register a new user account.', label: 'ctrl + u' })
  users_new.listen('click', () => (
    users_form
      .form_clear()
      .form_field_value('_id', '-')
      .form_field_value('status', 'participating')
      .form_field_hide('status')
      .select('.field.password').c('req'),
    
    users_modal
      .modal_header('create new user')
      .modal_action_hide('delete')
      .modal_action_hide('apply')
      .modal_action_show('create')
      .modal_open()
  ))

  problems_new.tooltip({ text: 'Register a new elimination problem.', label: 'ctrl + u' })
  problems_new.listen('click', () => (
    problems_form
      .form_clear()
      .form_field_value('_id', '-'),

    problems_modal
      .modal_header('create new problem')
      .modal_action_hide('delete')
      .modal_action_hide('apply')
      .modal_action_show('create')
      .modal_open()
  ))

  // Set up the tables
  config_table
    .table_header('Parameter', 'Value')

  users_table
    .table_header('User', '', '')
      .select('thead').select(0).append(th().append(users_new)).parent()

  problems_table
    .table_header('Problem', '', '', '')
      .select('thead').select(0).append(th().append(problems_new)).parent()

  // Mappers and comparators
  config_table.mapper = config_table_mapper
  config_table.comparator = config_table_comparator
  users_table.mapper = users_table_mapper
  users_table.comparator = users_table_comparator
  problems_table.mapper = problems_table_mapper
  problems_table.comparator = problems_table_comparator

  // Save the config
  function load_config() {
    X.request('./admin/configlist', 'POST')
      .then(({ config }) => PHO2.config(config))
      .then(() => config_label.t(PHO2.config().length))
      .then(() => config_table.table_data(PHO2.config()))
      .then(() => config_table.table_sort(config_table.comparator))
      .then(() => config_table.table_map(config_table.mapper))
  }

  // Save the users
  function load_users() {
    X.request('./admin/userlist', 'POST')
      .then(({ users }) => PHO2.users(users))
      .then(() => users_label.t(PHO2.users().length))
      .then(() => users_table.table_data(PHO2.users()))
      .then(() => users_table.table_sort(users_table.comparator))
      .then(() => users_table.table_map(users_table.mapper))
  }

  // Save the problems
  function load_problems() {
    X.request('./admin/problemlist', 'POST')
      .then(({ problems }) => PHO2.problems(problems))
      .then(() => problems_label.t(PHO2.problems().length))
      .then(() => problems_table.table_data(PHO2.problems()))
      .then(() => problems_table.table_sort(problems_table.comparator))
      .then(() => problems_table.table_map(problems_table.mapper))
  }

  load_config();
  load_users();
  load_problems();
})()