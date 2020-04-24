let approveEvent = document.getElementsByClassName("approve-event");
let rejectEvent = document.getElementsByClassName("reject-event");

// approval of event by admin
let updateEventApprove = function(event) {
    event.preventDefault();
    const val = confirm("Approve event?");
    if (val) {
        let index = this.getAttribute("value");
        const eventId = document.getElementsByTagName("TR")[parseInt(index) + 1].getAttribute("data-id");
        updateEvent(eventId, "approved");
    }
};

// rejection of event by admin
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
        },
        error: function(error) {
            console.log(error)
        }
    });
};