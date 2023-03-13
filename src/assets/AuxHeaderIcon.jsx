// Icons are from fonts.google.com/icons and svgrepo.com
// and are sized to be 24px square (adjust 'height' and 'width')
// and have a <title> inserted to display activity name on hover

import React from 'react';

const AuxHeaderIcon = props => {
  const { activity } = props;

  switch (activity) {
    case "Break":
      // icon: free_breakfast (google)
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <title>Break</title>
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M4 19h16v2H4zM20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm-4 10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5h10v8zm4-5h-2V5h2v3z"/>
        </svg>
      );
    case "Lunch":
      // icon: restaurant (google)
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <title>Lunch</title>
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4zm-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7z"/>
        </svg>
      );
    case "Customer Follow Up":
      // icon: paper-pencil (svgrepo)
      return (
        <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          width="24px" height="24px" viewBox="0 0 64 64" enable-background="new 0 0 24 24" space="preserve">
          <title>Customer Follow Up</title>
          <g>
            <path d="M0,58c0,2.206,1.794,4,4,4h36c2.206,0,4-1.794,4-4V18c0-1.64-0.841-3.67-2-4.828l-9.172-9.173C31.668,2.841,29.638,2,28,2
              H4C1.794,2,0,3.794,0,6V58z M37.171,14H32V8.828L37.171,14z M4,6h24v8c0,2.206,1.794,4,4,4h8v40H4V6z"/>
            <path d="M60,2h-4c-2.206,0-4,1.794-4,4v46c0,1.409,0.475,3.423,1.105,4.684l2.211,4.422c0.586,1.172,1.564,1.844,2.684,1.844
              s2.098-0.672,2.684-1.844l2.211-4.422C63.525,55.423,64,53.409,64,52V6C64,3.794,62.206,2,60,2z M60,6v6h-4V6H60z M59.316,54.895
              L58,57.527l-1.316-2.633C56.332,54.192,56,52.785,56,52V16h4v36C60,52.785,59.668,54.192,59.316,54.895z"/>
            <path d="M10,16h11c1.104,0,2-0.896,2-2s-0.896-2-2-2H10c-1.104,0-2,0.896-2,2S8.896,16,10,16z"/>
            <path d="M34,22H10c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2S35.104,22,34,22z"/>
            <path d="M34,30H10c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2S35.104,30,34,30z"/>
            <path d="M34,38H10c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2S35.104,38,34,38z"/>
            <path d="M34,46H10c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2S35.104,46,34,46z"/>
          </g>
        </svg>
      );
    case "Training-Meeting":
      // icon: teach (svgrepo)
      return (
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          width="24px" height="24px" viewBox="0 0 28.054 28.054" enable-background="new 0 0 24 24" space="preserve">
          <title>Training-Meeting</title>
          <g>
            <path fill="#010002" d="M27.961,1.867v11.204c0,0.319-0.258,0.578-0.578,0.578H12.144c-0.319,0-0.578-0.259-0.578-0.578
              v-0.885l1.156-0.775v1.082h14.082V2.444H12.721v4.229c-0.051,0.039-0.106,0.073-0.154,0.117l-0.162,0.112
              c-0.195-0.51-0.492-0.912-0.839-1.242V1.867c0-0.319,0.26-0.578,0.578-0.578h15.239C27.703,1.289,27.961,1.547,27.961,1.867z
              M14.316,9.461l0.692-0.464h-0.001c0.001-0.004,0.003-0.004,0.005-0.007c0.352-0.349,0.406-0.868,0.188-1.277l5.599-3.799
              l-0.254-0.375l-5.646,3.83c-0.177-0.128-0.375-0.209-0.583-0.216c-0.296-0.01-0.597,0.09-0.823,0.317c0,0-0.005,0.006-0.007,0.006
              l-0.138,0.096l-1.254,0.856V8.064c-0.233-2.769-3.442-2.728-3.442-2.728h-1.39L6.094,7.258L4.92,5.337H3.587
              c-3.621,0.068-3.493,2.727-3.493,2.727v6.206h0.002c0.001,0.016-0.002,0.035-0.002,0.048c0,0.591,0.477,1.066,1.066,1.066
              c0.587,0,1.064-0.477,1.064-1.066c0-0.013,0-0.032-0.002-0.048h0.002V8.53H2.89L2.882,26.613c0,0.795,0.646,1.441,1.438,1.441
              c0.795,0,1.439-0.646,1.439-1.441v-11.67H6.4v11.683l0.012,0.013c0.01,0.781,0.646,1.415,1.432,1.415
              c0.789,0,1.431-0.643,1.431-1.432L9.271,8.5h0.693v1.888c0,0.002,0,0.007,0,0.009c0,0.587,0.477,1.065,1.063,1.065
              c0.173,0,0.328-0.049,0.475-0.125l0.005,0.007l1.84-1.234L14.316,9.461z M6.073,4.874c1.346,0,2.437-1.091,2.437-2.437
              S7.419,0,6.073,0S3.636,1.092,3.636,2.437S4.727,4.874,6.073,4.874z"/>
          </g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
        </svg>
      );
    case "OnOutboundEmailActivity ":
      // icon: email (google)
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <title>OnOutboundEmailActivity</title>
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
        </svg>
      );
    case "Unavailable":
      // icon: do_not_disturb (google)
      return (
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
          <title>Unavailable</title>
          <g>
            <rect fill="none" height="24" width="24"/>
          </g>
          <g><g><g>
            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-1.85,0.63-3.55,1.69-4.9L16.9,18.31C15.55,19.37,13.85,20,12,20z M18.31,16.9L7.1,5.69C8.45,4.63,10.15,4,12,4 c4.42,0,8,3.58,8,8C20,13.85,19.37,15.55,18.31,16.9z"/>
          </g></g></g>
        </svg>
      );
    default:
      return (
        <span>{activity}</span>
      );
  }
};

export default AuxHeaderIcon;