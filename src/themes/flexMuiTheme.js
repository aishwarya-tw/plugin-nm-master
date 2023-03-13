import * as Flex from '@twilio/flex-ui';
const manager = Flex.Manager.getInstance();
const themeBaseName = manager.configuration.colorTheme.baseName;
export default Flex.createTheme(Flex[themeBaseName]);
