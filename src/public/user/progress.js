
const PROGRESS = (() => {

  // Tabs and tab menu
  const tabs = 
    DOM.stateful_tabs('progress-tabs', DOM.select('.tabs'));
  
  // Inits the menu tabs, DO NOT REMOVE
  const tabs_menu = 
    DOM.stateful_menu(DOM.select('.tabs-menu'))
      .menu_on_selected(c => tabs.tabs_active_tab(c))
      .menu_selected_item('.problems');

  // Tables, labels and, modals
  const problems_label = DOM.select('.problems-label');
  const problems_table = DOM.stateful_table(DOM.select('.problems-table'));
  const problems_modal = DOM.stateful_modal(DOM.select('.problems-modal'));
  const problems_form = DOM.stateful_form();

  const submissions_label = DOM.select('.submissions-label');
  const submissions_table = DOM.stateful_table(DOM.select('.submissions-table'));
  const submissions_modal = DOM.stateful_modal(DOM.select('.submissions-modal'))

  // Set up the modals
  problems_modal.modal_header('Problem Details');
  submissions_modal.modal_header('Submission Details');

  // Search bar
  const search_bar = DOM.select('.search-bar')

  // Filter feature
  search_bar.tooltip({ text: 'Filter the rows of the active table by the search term.', label: 'ctrl + f' })
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
  DOM.keybind({ ctrlKey: true, key: 'f' }, () => search_bar.focus())
  DOM.keybind({ key: 'Escape' }, () => 
    (problems_modal.modal_close(), submissions_modal.modal_close()))

  /**
   *  Reusable components and styles
   */

  // Some convenience styles
  const auto_width = { width: 0 };
  const full_width = { width: document.width };

  // Built in components
  const { tr, or, td, label, link, div, span, button, buttons, sup, br, pre } = C.LIB;

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
  const view_button = 
    C.new(() => button().c('view-button').t('View'))

  // Table view buttons
  const td_view_button = 
    C.new(() => td_auto_right().append(buttons().append(view_button())))

  // Problem submission helper methods
  const problem_submissions = (problem) => 
    PHO2.submissions().filter(submission => submission.problem_id === problem._id)

  const problem_submissions_count = (problem) =>
    problem_submissions(problem).length

  const problem_submissions_verdict = (problem) =>
    problem_submissions(problem)
      .filter(submission => submission.verdict === 'correct').length > 0

  // Submission cooldown helpers
  const submissions_cooldown = () => 
    parseInt(PHO2.config().SUBMISSION_COOLDOWN.toString())

  const submissions_elapsed = () =>
    parseInt(Time.now() - PHO2.user().last_submit)

  const submissions_countdown = () =>
    Math.abs(submissions_cooldown() - submissions_elapsed())

  const submission_locked = () =>
    submissions_elapsed() <= submissions_cooldown()

  // Interval for the cooldown
  let submission_interval = 0;
  const submission_set_interval = () => submission_interval = setInterval(update_cooldown, 1000);
  const submission_clear_interval = () => clearInterval(submission_interval);

  // Forms
  problems_form
    .form_field('_id', { type: 'text' })
    .form_field('answer', { type: 'text' }, { 
      checker: Formatter.valid_submission_answer, 
      mapper: Formatter.lift_submission_answer 
    })
    .form_text('countdown', '')
    .form_field_hide('_id')
    .select('.text.countdown').append(div().c('ui', 'header', 'massive', 'red', 'text'))

  // Handles clicks on the problems table
  const problems_table_handler = (problem) => (
    problems_form
      .form_clear()
      .form_field_value('_id', problem._id),
    problem_submissions_verdict(problem) 
      ? problems_form.form_field_hide('answer').select('.text.countdown').display('block')
      : problems_form.form_field_show('answer').select('.text.countdown').display(false),
    
    problems_modal
      .modal_header(problem.name)
      .modal_clear(),
    problem_submissions_verdict(problem)
      ? problems_modal.modal_action_hide('submit')
      : problems_modal.modal_action_show('submit'),
    
    problems_modal
      .modal_append(
        problems_form, br(),
        label().t(`${problem_submissions_count(problem)} submissions`),
        label().t(`${problem_submissions_verdict(problem) ? 'correct' : problem_submissions_count(problem) === 0 ? '' : 'wrong'}`)
          .c(problem_submissions_verdict(problem) ? 'green' : problem_submissions_count(problem) === 0 ? 'hidden' : 'red')
          .c(problem_submissions_verdict(problem) ? 'default' : 'basic'))
      .modal_open(),

    problem_submissions_verdict(problem) || (submission_set_interval(), update_cooldown())
  )

  // Handles clicks on the submissions table
  const submissions_table_handler = (submission) => (
    submissions_modal
      .modal_header(submission.problem_code.number + submission.problem_code.alpha + ' ' + submission.problem_name)
      .modal_clear()
      .modal_append(
        br(),
        span().t(submission.answer.mantissa + ' &times; 10').append(sup().t(submission.answer.exponent))
          .c('ui', 'header', 'huge', 'text'), br(), br(), br(),
        label().t(Time.timestamp_to_mdy_hms(submission.timestamp)),
        label().t(submission.verdict)
          .c(submission.verdict === 'correct' ? 'green' : 'red' )
          .c(submission.verdict === 'correct' ? 'default' : 'basic' ))
      .modal_open()
  )

  // Comparators
  const problems_table_comparator = (a, b) => 
    (a.code.number + a.code.alpha).localeCompare(b.code.number + b.code.alpha)
  const submissions_table_comparator = (a, b) => b.timestamp - a.timestamp

  // Problem table mapper
  const problems_table_mapper = (problem) => (
    tr_hoverable()
      .tooltip({ text: 
        problem_submissions_verdict(problem) 
          ? 'Click to view details.'
          : 'Click to submit for this problem.' })
      .listen('click', () => problems_table_handler(problem))
      .append(
        td_auto_label({ '.label': { 
          t: problem.code.number + problem.code.alpha,
          c: problem_submissions_verdict(problem) 
            ? [ 'green' ] : problem_submissions_count(problem) === 0
            ? [ 'default' ]
            : [ 'red', 'basic' ] 
        } }),
        td_auto().t(problem.name),
        td_auto().t(problem.points),
        td_auto()
      )
  )

  // Submission table mapper
  const submissions_table_mapper = (submission) => (
    tr_hoverable()
      .tooltip({ text: 'Click to view details.' })
      .listen('click', () => submissions_table_handler(submission))
      .append(
        td_auto_label({ '.label': { t: Time.interval_to_since(Time.now() - submission.timestamp) }}),
        td_auto_label({ '.label': { t: submission.problem_code.number + submission.problem_code.alpha }}),
        td_auto().t(submission.answer.mantissa + ' &times; 10').append(sup().t(submission.answer.exponent)),
        td_auto_label({ 
          '.label': {
            t: submission.verdict,
            c: submission.verdict === 'correct' ? [ 'green' ] : [ 'red', 'basic' ]
          }
        })
      )
  )

  const action_submit = (modal, form, target, callback) => (
    modal.modal_action('submit', () => 
      form.form_submit(target)
        .then(({ message }) => DOM.toast({ title: message }))
        .then(() => callback())
        .then(() => modal.modal_close())
        .catch(({ error }) => DOM.toast({ title: error, label: 'error' }))),
    modal.select('.action.submit').c('blue')
  )

  const action_close = (modal, callback) => (
    modal.modal_action('close', () => (callback(), modal.modal_close())),
    modal.select('.action.close').c('black')
  )

  // Modal buttons
  action_submit(problems_modal, problems_form, './user/submit', 
    () => (load_user(), load_submissions().then(() => load_problems()), submission_clear_interval()))
  action_close(problems_modal, 
    () => submission_clear_interval())
  action_close(submissions_modal, 
    () => true)
  
  // Set up the tables and their props
  problems_table.table_header('Problem', '', 'Points')
  problems_table.mapper = problems_table_mapper
  problems_table.comparator = problems_table_comparator
  submissions_table.table_header('Submission', 'Submitted Answer', 'Verdict')
  submissions_table.mapper = submissions_table_mapper
  submissions_table.comparator = submissions_table_comparator

  // Save the submissions
  function load_submissions() {
    return X.request('./user/submissionlist', 'POST')
      .then(({ submissions }) => PHO2.submissions(submissions))
      .then(() => submissions_label.t(PHO2.submissions().length))
      .then(() => submissions_table.table_data(PHO2.submissions()))
      .then(() => submissions_table.table_sort(submissions_table.comparator))
      .then(() => submissions_table.table_map(submissions_table.mapper))
  }

  // Save the problems
  function load_problems() {
    return X.request('./user/problemlist', 'POST')
      .then(({ problems }) => PHO2.problems(
        Settings.hide_answered() 
          ? problems.filter(p => !problem_submissions_verdict(p))
          : problems))
      .then(() => problems_label.t(PHO2.problems().length))
      .then(() => problems_table.table_data(PHO2.problems()))
      .then(() => problems_table.table_sort(problems_table.comparator))
      .then(() => problems_table.table_map(problems_table.mapper))
  }

  // Save config data
  function load_config() {
    return X.request('./user/configlist', 'POST')
      .then(({ config }) => PHO2.config(
        config.reduce((a, p) => (a[p.key] = p.value, a), {})))
  }

  // Save user data
  function load_user() {
    return X.request('./user/data', 'POST')
      .then((user) => PHO2.user(user))
  }

  // Updates the cooldown display
  function update_cooldown() {
    submission_locked()
      ? problems_form
          .form_field_hide('answer')
          .select('.text.countdown').display('block').parent()
          .select('.text.countdown').select('div').t(Time.millis_to_ms(submissions_countdown())) &&
        problems_modal.select('.action.submit').c('disabled')
      : problems_form
          .form_field_show('answer')
          .select('.text.countdown').display(false) &&
        problems_modal  
          .select('.action.submit').uc('disabled')
  }

  // Load the stuffs
  load_user()
    .then(() => load_config())
  load_submissions()
    .then(() => load_problems())

  // Interval for updating time display of submissions without making internet request
  // Update every minute
  setInterval(() => submissions_table.table_map(submissions_table.mapper), 60000)
})()