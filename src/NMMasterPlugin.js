import { FlexPlugin } from "@twilio/flex-plugin";

import { PLUGIN_NAME } from "./utils/constants";

import ConversationTimeoutListener from "./init/ConversationTimeoutListener";
import CustomComponents from "./init/CustomComponents";
import DataRetrieval from "./init/DataRetrieval";
import DefaultChannels from "./init/DefaultChannels";
import Notifications from "./init/Notifications";
import Reducers from "./init/Reducers";
import UIConfiguration from "./init/UIConfiguration";
import EventListeners from "./init/EventListeners";
import { teamsViewFilters } from "./init/TeamsViewFilterConfiguration";
import TwilioMediaStream from "./init/TwilioMediaStream";

import "./actions";
import "./events";
import "./strings";
import "./taskChannels";

import "./assets/styles.css";

export default class NmMasterPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    const initializers = [
      ConversationTimeoutListener,
      CustomComponents,
      DataRetrieval,
      DefaultChannels,
      Notifications,
      Reducers,
      UIConfiguration,
      EventListeners,
      teamsViewFilters,
      TwilioMediaStream,
    ];
    initializers.forEach((init) => init(flex, manager));
  }
}
