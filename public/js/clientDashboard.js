// public/js/dashboard.js

$(document).ready(function() {
    // Fetch and display client profile
    fetchClientProfile();

    // Handle post work form submission
    $('#postWorkForm').on('submit', function(e) {
        e.preventDefault();
        postNewWork();
    });
});

// Function to fetch client profile
function fetchClientProfile() {
    $.ajax({
        url: '/api/client/profile',
        method: 'GET',
        success: function(data) {
            $('#avatar').attr('src', data.avatar);
            $('#fullName').text(data.fullName);
            $('#username').text(data.username);
            $('#email').text(data.email);
            $('#location').text(data.location);
            fetchNearbyFreelancers(data.location);
            fetchClientWorks();
        },
        error: function(err) {
            console.error('Error fetching profile:', err);
            alert('Failed to load profile.');
        }
    });
}

// Function to fetch nearby freelancers
function fetchNearbyFreelancers(location) {
    $.ajax({
        url: `/api/freelancers/nearby?location=${encodeURIComponent(location)}`,
        method: 'GET',
        success: function(freelancers) {
            const freelancersList = $('#freelancersList');
            freelancersList.empty();
            if (freelancers.length === 0) {
                $('#noFreelancers').show();
            } else {
                $('#noFreelancers').hide();
                freelancers.forEach(freelancer => {
                    const freelancerCard = `
                        <div class="col-md-4 freelancer-card">
                            <div class="card">
                                <img src="${freelancer.avatar}" class="card-img-top" alt="${freelancer.fullName}">
                                <div class="card-body">
                                    <h5 class="card-title">${freelancer.fullName}</h5>
                                    <p class="card-text"><strong>Skills:</strong> ${freelancer.skills.join(', ')}</p>
                                    <p class="card-text"><strong>Email:</strong> ${freelancer.email}</p>
                                    <button class="btn btn-success" onclick="applyForWork('${freelancer._id}')">Apply for Work</button>
                                </div>
                            </div>
                        </div>
                    `;
                    freelancersList.append(freelancerCard);
                });
            }
        },
        error: function(err) {
            console.error('Error fetching freelancers:', err);
            alert('Failed to load freelancers.');
        }
    });
}

// Function to post new work
function postNewWork() {
    const title = $('#workTitle').val().trim();
    const description = $('#workDescription').val().trim();

    if (!title) {
        alert('Work title is required.');
        return;
    }

    $.ajax({
        url: '/api/client/work',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ title, description }),
        success: function(newWork) {
            $('#workTitle').val('');
            $('#workDescription').val('');
            appendWorkItem(newWork);
            alert('Work posted successfully.');
        },
        error: function(err) {
            console.error('Error posting work:', err);
            alert('Failed to post work.');
        }
    });
}

// Function to fetch client's work listings
function fetchClientWorks() {
    $.ajax({
        url: '/api/client/work',
        method: 'GET',
        success: function(works) {
            const workList = $('#workList');
            workList.empty();
            if (works.length === 0) {
                $('#noWork').show();
            } else {
                $('#noWork').hide();
                works.forEach(work => {
                    appendWorkItem(work);
                });
            }
        },
        error: function(err) {
            console.error('Error fetching works:', err);
            alert('Failed to load work listings.');
        }
    });
}

// Function to append a single work item to the list
function appendWorkItem(work) {
    const workList = $('#workList');
    const workItem = `
        <div class="list-group-item">
            <h5>${work.title}</h5>
            <p>${work.description || 'No description provided.'}</p>
            <p><strong>Status:</strong> ${work.status}</p>
            ${work.assignedFreelancer ? `<p><strong>Assigned to:</strong> ${work.assignedFreelancer.fullName}</p>` : ''}
        </div>
    `;
    workList.append(workItem);
}

// Placeholder function for applying for work
function applyForWork(freelancerId) {
    // Implement functionality to apply for work
    // This could involve creating a job application or notifying the freelancer
    alert(`Apply for work with Freelancer ID: ${freelancerId}`);
}
