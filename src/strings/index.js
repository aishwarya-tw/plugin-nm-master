/*
 * override manager strings that are displayed in Flex UI
 *
 * import { Manager } from '@twilio/flex-ui';
 * const manager = Manager.getInstance();
 *
 * manager.strings.TaskHeaderLine = 'Hello world';
 */
import { Manager } from '@twilio/flex-ui';
const manager = Manager.getInstance();

manager.strings.PostponeTaskLimitNotification =
  'You cannot postpone this task more than twice.';
manager.strings.PostponeWorkerLimitNotification =
  'You cannot postpone more than 4 tasks.';
manager.strings.CDTIncompleteNotification =
  'Info missing from disposition form, can not complete task: {{missingInfo}}';
manager.strings.BackendErrorNotification =
  'There has been an internal error; {{errorMessage}}';
manager.strings.BackendWarningNotification =
  'Please correct any errors before sending your message.';
manager.strings.ResponseLibrarySavedNotification = 'Response saved.';
manager.strings.ResponseLibrarySaveFailedNotification =
  'Failed to save response.';

manager.strings.UpdatedTrafficDistributionSuccess =
  'Successfully updated Traffic Distribution Weights';

manager.strings.UpdatedTrafficDistributionError =
  'Failed to update Traffic Distribution Weights';

manager.strings.TrafficDistributionWeightsNotValid =
  'Each set of provider weights must equal 100%';

manager.strings.GetTrafficDistributionError =
  'Failed to retrieve Traffic Distribution Weights';

manager.strings.TaskInfoPanelContent = `
    <h1>TASK CONTEXT</h1>
    <h2>Task type</h2>
    <p>{{task.channelType}}</p>
    <h2>Task created on</h2>
    <p>{{task.dateCreated}}</p>
    <h2>Task priority</h2>
    <p>{{task.priority}}</p>
    <h2>Task queue</h2>
    <p>{{task.queueName}}</p>
    <hr />
    <h1>CUSTOMER INFOMATION</h1>
    {{#if task.attributes.firstName}}
      <h2>Name</h2>
      {{task.attributes.firstName}} {{task.attributes.lastName}}
    {{/if}}
    {{#if task.attributes.phoneNum}}
      <h2>Phone Number</h2>
      <p>{{task.attributes.phoneNum}}</p>
    {{/if}}
    {{#if task.attributes.emailAddr}}
      <h2>Email Address</h2>
      <p>{{task.attributes.emailAddr}}</p>
    {{/if}}
    <h2>Order Number</h2>
    {{#if task.attributes.orderNum}}
      <p>{{task.attributes.orderNum}}</p>
    {{/if}}
    {{#unless task.attributes.orderNum}}
      <i>Not Available</i>
    {{/unless}}

    <h2> Category </h2>
    {{#if task.attributes.styleAdvisor}}
    <p> {{task.attributes.styleAdvisor}} </p>
    {{/if}}

    {{#unless task.attributes.styleAdvisor}}
      <i>Not Available</i>
    {{/unless}}
  `;
manager.strings.GeneralErrorNotification =
  'Error: {{errorMessage}}';