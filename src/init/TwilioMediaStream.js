import { TASK_INDICATOR_ICONS } from '../utils/constants';
import Resource from '../utils/resource';

// import CustomTaskList from './components/CustomTaskList/CustomTaskList';

const MediaStartSecWrap = Resource('media-start-sec-wrap');
const MediaStopByNameSecWrap = Resource('media-stop-byname-sec-wrap');

export default (flex, manager) => {

    // Reservation Created Event
    manager.workerClient.on("reservationCreated", (reservation) => { 

    console.log(`***Call SID in reservation.task.attributes: ${'call_sid' in reservation.task.attributes}`)
    console.log(`***Call Direction: ${reservation.task.attributes.direction}`)
    console.log(`***Reservation details: ${JSON.stringify(reservation.task.attributes)}`)
    console.log(`***Reservation Worker SID: ${reservation.workerSid}`)
    console.log(`***Worker Name: ${manager.workerClient.name}`)

    if( manager.workerClient.attributes.routing.skills.includes('Cresta') ) {

        // Check voice call direction for Inbound

        if ('call_sid' in reservation.task.attributes && 
            reservation.task.attributes.direction === 'inbound' &&
            reservation.task.attributes.preferredLanguage === 'English') {        

            // ** On Action of worker accepting Flex Task **
            reservation.on("accepted", (reservation) => {
            console.log('*** RESERVATION ACCEPTED ***')
            console.log('**** CALLING FETCH TO START MEDIA STREAM ****')
        
            const agentId = manager.workerClient.name;
            const callId = reservation.task.attributes.call_sid;
            const token = manager.store.getState().flex.session.ssoTokenPayload.token;
    
            MediaStartSecWrap.create({ agentId, callId, token })
                .then(response => {
                    console.log("response: ", response);
                })
                .catch(error => {
                    console.log('Error starting media stream: ', error);
                })
            }) 

            // ** On Action of worker wrapping up a Flex Task **
            reservation.on("wrapup", (reservation) => {
                console.log('**** CALLING FETCH TO END MEDIA ****');
                
                const transfer = reservation.task.transfers.outgoing ? true : false;
             
                if(transfer) {
                    const agentId = manager.workerClient.name;
                    const callId = reservation.task.attributes.call_sid;
                    const token = manager.store.getState().flex.session.ssoTokenPayload.token;

                    MediaStopByNameSecWrap.create({ agentId, callId, token })
                        .then(response => {
                            console.log("response: ", response);
                        })
                        .catch(error => {
                            console.log('Error ending media stream: ', error);
                        })
                }
            })
        }

        // Check voice call direction for Outbound

        if (reservation.task.attributes.direction === 'outbound') {
            // ** On Action of Flex Task attributes being updated / not: outbound tasks are auto accepted **
            reservation.task.on("updated", (task) => {
            // Check the task.status as this event will also fire for task.status === wrapping
            // We need to wait for the Task to be in reserved status to get the updated task attribute details
            if ('customer' in task.attributes.conference.participants && task.status === 'reserved' ) {
                console.log("****TASK UPDATED****");
                console.log(`The Task Status is: ${task.status}`)
                console.log(`The Task Attributes are now ${JSON.stringify(task.attributes)}`)

                const agentId = manager.workerClient.name;
                const callId = task.attributes.conference.participants.customer;
                const token = manager.store.getState().flex.session.ssoTokenPayload.token;

                MediaStartSecWrap.create({ agentId, callId, token })
                    .then(response => {
                        console.log("response: ", response);
                    })
                    .catch(error => {
                        console.log('Error starting media stream: ', error);
                    })
            }
            })

            // ** On Action of worker wrapping up a Flex Task **
            reservation.on("wrapup", (reservation) => {
            console.log('**** CALLING FETCH TO END MEDIA ****');
            const transfer = reservation.task.transfers.outgoing ? true : false;
            
            if(transfer) {
                const agentId = manager.workerClient.name;
                const callId = reservation.task.attributes.conference.participants.customer;
                const token = manager.store.getState().flex.session.ssoTokenPayload.token;

                MediaStopByNameSecWrap.create({ agentId, callId, token })
                    .then(response => {
                        console.log("response: ", response);
                    })
                    .catch(error => {
                        console.log('Error ending media stream: ', JSON.stringify(error));
                    })
            }
            })
        }
    }
    })

    // Below two lines can be removed but useful to see if Plugin Loaded when testing

    // const layoutOptions = { sortOrder: -1 };
    // flex.AgentDesktopView.Panel1.Content.add(<CustomTaskList key="SamplePlugin-component" />, layoutOptions);
}