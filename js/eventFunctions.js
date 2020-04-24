let approveEvent = document.getElementsByClassName("approve-event");
let rejectEvent = document.getElementsByClassName("reject-event");
let joinEvent = document.getElementsByClassName("join-event");


let updateEventApprove = function(event) {
    event.preventDefault();
    const val = confirm("Approve event?");
    if (val) {
        console.log("entered"); 
        let index = this.getAttribute("value");
        const eventId = document.getElementsByTagName("TR")[parseInt(index) + 1].getAttribute("data-id");
        console.log("approving an event"); 
        console.log(eventId); 
        updateEvent(eventId, "approved");
    }
};

let updateEventReject = function(event) {
    event.preventDefault();
    const val = confirm("Reject event?");
    if (val) {
        let index = this.getAttribute("value");
        const eventId = document.getElementsByTagName("TR")[parseInt(index) + 1].getAttribute("data-id");
        updateEvent(eventId, "rejected");
    }
};

for (let i = 0; i < approveEvent.length; i++) {
    approveEvent[i].addEventListener('click', updateEventApprove, false);
}

for (let i = 0; i < rejectEvent.length; i++) {
    rejectEvent[i].addEventListener('click', updateEventReject, false);
}

let updateEvent = function(eventId, status) {
    $.ajax({
        type: "post",
        url: "/updateEvent",
        data: {
            "eventId": eventId,
            "status": status
        },
        success: function() {
            window.location.href = window.location.href;
            //TODO: update data without reloading
        },
        error: function(error) {
            console.log(error)
        }
    });
};

//kannu functions

// join event request by user
let joinEventReq = function(event) {
    event.preventDefault();
    const val = confirm("Want to join this event?");
    if (val) {
        let index = this.getAttribute("value");
        const otherEvents = document.getElementsByClassName("other-events");
        const eventId = otherEvents[0].getElementsByTagName("TR")[parseInt(index) + 1].getAttribute("data-id");
        //const eventId = document.getElementsByTagName("TR")[parseInt(index) + 1].getAttribute("data-id");
        sendReq(eventId);
    }
};

for (let i = 0; i < joinEvent.length; i++) {
    joinEvent[i].addEventListener('click', joinEventReq, false);
}

let sendReq = function(eventId) {
    $.ajax({
        type: "post",
        url: "/joinEvent",
        data: {
            "eventId": eventId
        },
        success: function() {
            window.location.href = window.location.href;
        },
        error: function(error) {
            console.log(error)
        }
    });
};