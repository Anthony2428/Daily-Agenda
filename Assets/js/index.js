
const today = moment();
$('#currentDay').text(today.format("ddd MMMM Do, YYYY HH:mm"));
const schedule = document.getElementById('schedule');
const startOfThisEvent = document.querySelector('#dropdownMenuButton');
const endOfThisEvent = document.querySelector('#dropdownMenuButton2');
const titleOfThisEvent = document.querySelector('#to-do');
const savedEvents = window.localStorage;

const validate = async (title, notes, start, end) => {
    if (title === '' || notes === '' || start === 'Start Time' || end === 'End Time') {

        return('notValid');
    } else {return('Valid')}
}
const saveEvent = async event => {
    event.preventDefault();
    let eventForm = document.forms[0];
    let valid = await validate(eventForm[2].value, eventForm[3].value, document.getElementById('startTime').value, document.getElementById('endTime').value);
    if (valid === 'notValid') {
        alert('Event Must have a Start Time, an End Time, a Title, and a Side Note')
        
        return;
    }
    let newScheduleItem = {}
    let eventTitle = {'title': eventForm[2].value};
    let eventNotes = {'notes': eventForm[3].value};
    let eventStartTime = {'startTime': document.getElementById('startTime').value};
    let eventEndTime = {'endTime': document.getElementById('endTime').value};
    Object.assign(newScheduleItem, eventTitle, eventNotes, eventStartTime, eventEndTime);
    savedEvents.setItem(JSON.stringify(eventTitle.title), JSON.stringify(Object.values(newScheduleItem)));
    eventForm.reset();
    $('#myModal').modal('toggle')
    todaysSchedule();
    return;
};
const removeEvent = event => {
    savedEvents.removeItem(event)
    let item = document.getElementById(event)
    let list = document.getElementById('listedEvents')
    item.parentNode.removeChild(item);
    todaysSchedule();
    return;
}
const viewEvents = event => {
    $('#viewEventsModal').modal('toggle');
    $('#listedEvents').innerHTML = '';
    let newList = document.createElement('ul')
    newList.setAttribute('class', 'list-group');
    newList.setAttribute('id', 'listedEvents');
    for (let i = 0; i < savedEvents.length; i++){
        let newListItem = document.createElement('li');
        newListItem.setAttribute('class', 'list-group-item');
        let newButton = document.createElement('button');
        newButton.setAttribute('type', 'button');
        newButton.setAttribute('class', 'btn btn-outline-danger btn-sm');
        newButton.setAttribute('style', 'float: right; font-weight: bolder;');
        newButton.setAttribute('onclick', 'removeEvent(this.value)');
        newButton.innerHTML = 'X';
        let itemName = savedEvents.key(i);
        newListItem.setAttribute('id', itemName);
        let item = JSON.parse(savedEvents.getItem(itemName));
        newListItem.innerHTML = `${ item[0] }: ${ item[2] } until ${ item[3] } --- \n Notes: ${ item [1] }`;
        if (item[3] < today.format("HH:MM")) {
            newListItem.setAttribute('class', 'list-group-item list-group-item-success');
        } else if (item[2] < today.format("HH:MM") && item[3] > today.format("HH:MM")) {
            newListItem.setAttribute('class', 'list-group-item list-group-item-warning');
        } else {
            newListItem.setAttribute('class', 'list-group-item list-group-item-info');
        }
        newButton.value = itemName;
        newListItem.append(newButton)
        newList.append(newListItem)
    }
    $('#listEvents').append(newList)
    return;
}

const saveEventButton = document.querySelector('#saveEvent');
saveEventButton.addEventListener('click', saveEvent);

const todaysSchedule = async () => {
    const timeToday = moment().format("HH:00")
    for (let i = 0; i < 24; i++) {
        let newButton2 = document.createElement('button');
            newButton2.setAttribute('type', 'button');
            newButton2.setAttribute('id', 'viewEvents');
            newButton2.setAttribute('class', 'btn btn-outline-primary btn-sm');
            newButton2.setAttribute('style', 'float: right');
            newButton2.setAttribute('onclick', 'this.blur()');
            newButton2.innerHTML = 'View Events';
            newButton2.setAttribute('class', 'btn btn-outline-primary btn-sm');
            newButton2.addEventListener('click', viewEvents);

        let newButton = document.createElement('button');
            newButton.setAttribute('type', 'button');
            newButton.setAttribute('id', 'newEvent');
            newButton.setAttribute('class', 'btn btn-outline-primary btn-sm');
            newButton.setAttribute('style', 'float: right');
            newButton.setAttribute('onclick', 'this.blur()');
            newButton.setAttribute('data-toggle', 'modal');
            newButton.setAttribute('data-target', '#myModal');
            newButton.innerHTML = 'New Event';

        let newList = document.createElement('ul');
        let newListItem = document.createElement('li');
        newList.setAttribute('class', 'list-group');
        newListItem.append(moment().hour(i).format("HH:00"));
        newListItem.append(newButton);
        if (newListItem.innerHTML.includes(timeToday)) {
            newListItem.setAttribute('class', 'list-group-item bg-success')
            newListItem.append(newButton2);
        } else if (newListItem.innerHTML < timeToday) {
            newListItem.setAttribute('class', 'list-group-item bg-secondary');
            newButton.setAttribute('disabled', '')
        } else {
            newListItem.setAttribute('class', 'list-group-item bg-primary');
            newButton.setAttribute('class', 'btn btn-outline-success btn-sm')
        }

        newList.append(newListItem);
        schedule.append(newList);
    }      
    return;
}
todaysSchedule(savedEvents);


const saveInput = async event => {
    let title = event;
    console.log(title);
}

