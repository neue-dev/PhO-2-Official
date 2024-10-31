
const PROGRESS = (() => {

  // ! <!-- ! move elsewhere  -->
  const date = (timestamp) => {
    
    const date = new Date(timestamp * 1)
    const date_options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return `${date.toString().substring(4, 24)}`;
  }

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
  const problems_modal = DOM.stateful_modal('problems-modal', DOM.select('.problems-modal'));

  const submissions_label = DOM.select('.submissions-label');
  const submissions_table = DOM.stateful_table('submissions-table', DOM.select('.submissions-table'));
  const submissions_modal = DOM.stateful_modal('submissions-modal', DOM.select('.submissions-modal'))

  // Set up the modals
  problems_modal.modal_header('Problem Details');
  submissions_modal.modal_header('Submission Details');

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

  // Count submissions
  const problem_submissions = (problem) => 
    PHO2.submissions().filter(submission => submission.problem_id === problem._id)

  const problem_submissions_count = (problem) =>
    problem_submissions(problem).length

  const problem_submissions_verdict = (problem) =>
    problem_submissions(problem)
      .filter(submission => submission.verdict === 'correct').length > 0

  const problems_table_handler = (problem) => (
    problems_modal.modal_header(problem.name),
    problems_modal.modal_clear(),
    problems_modal.modal_append(
      label().t(`${problem_submissions_count(problem)} submissions`),
      label().t(`${problem_submissions_verdict(problem) ? 'correct' : 'wrong'}`)
        .c(problem_submissions_verdict(problem) ? 'green' : 'red')
        .c(problem_submissions_verdict(problem) ? 'default' : 'basic')),
      problems_modal.modal_open()
  )

  const submissions_table_handler = (submission) => (
    submissions_modal.modal_header(submission.problemCodeName),
    submissions_modal.modal_clear(),
    submissions_modal.modal_append(
      br(),
      span().t(submission.answer.mantissa + ' &times; 10').append(sup().t(submission.answer.exponent))
        .c('ui', 'header', 'huge', 'text'),
      br(), br(), br(),
      label().t(date(submission.timestamp)),
      label().t(submission.verdict)
        .c(submission.verdict === 'correct' ? 'green' : 'red' )
        .c(submission.verdict === 'correct' ? 'default' : 'basic' )),
    submissions_modal.modal_open()
  )

  const problems_table_mapper = (problem) => (
    tr_hoverable()
      .listen('click', () => problems_table_handler(problem))
      .append(
        td_auto_label({ '.label': { t: problem.code.number + problem.code.alpha } }),
        td_auto().t(problem.name),
        td_auto().t(problem.points),
        td_auto()
      )
  )

  const submissions_table_mapper = (submission) => (
    tr_hoverable()
      .listen('click', () => submissions_table_handler(submission))
      .append(
        td_auto_label({ '.label': { t: submission.problemCodeName.split(' ')[0] }}),
        td_auto().t(submission.answer.mantissa + ' &times; 10').append(sup().t(submission.answer.exponent)),
        td_auto_label({ 
          '.label': {
            t: submission.verdict,
            c: submission.verdict === 'correct' ? [ 'green' ] : [ 'red', 'basic' ]
          }
        })
      )
  )

  const action_close = (modal) => (
    modal.modal_action('close', () => modal.modal_close()),
    modal.select('.action.close').c('black')
  )

  // Modal buttons
  action_close(problems_modal)
  action_close(submissions_modal)
  
  // Set up the tables and modals
  problems_table
    .table_header('Problem', '', 'Points')
    .mapper = problems_table_mapper;

  submissions_table
    .table_header('Submission', 'Submitted Answer', 'Verdict')
    .mapper = submissions_table_mapper;

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