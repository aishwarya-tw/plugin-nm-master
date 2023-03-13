export default (flex, manager) => {
  const configuration = {
    colorTheme: {
      colors: {
        base1: '#fff', // task canvas
        base2: '#ededed', // task list pane, crm container
        base4: '#ccc', // border colors
        tabSelectedColor: '#009cff', // underline for selected tab
        darkTextColor: '#252525', // primary text
        lightTextColor: '#fff' // secondary text, icons
      },
      overrides: {
        MainHeader: {
          Container: {
            background: '#000',
            color: '#fff'
          }
        },
        SideNav: {
          Container: {
            background: '#2f2f2f'
          },
          Button: {
            background: '#2f2f2f'
          }
        }
      }
    }
  };

  manager.updateConfig(configuration);
};
