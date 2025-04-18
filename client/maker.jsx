/* create the job application in html */
// TODO: change domo names, fix the html for making the app

const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#jobTitle').value;
    const company = e.target.querySelector('#company').value;
    const pay = e.target.querySelector('#pay').value;
    const type = e.target.querySelector('#jobType').value;
    const applied = e.target.querySelector('#applied').value;
    const status = e.target.querySelector('#status').value;

    if (!title || !company || !pay) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { title, company, pay, type, applied, status }, onDomoAdded);
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <input id="jobTitle" type="text" name="title" placeholder="Job Title" />

            <input id="company" type="text" name="company" placeholder="Job Company" />

            <input id="pay" type="number" min="0" name="pay" placeholder="Pay" />

            <label htmlFor="type">Job Type: </label>
            <select name="type" id="jobType"> 
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="volunteer">Volunteer</option>
            </select>

            <label htmlFor="applied">Applied?: </label>
            <select name="applied" id="applied">
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>

            <label htmlFor="status">Status: </label>
            <select name="status" id="status">
                <option value="waiting">Waiting</option>
                <option value="rejected">Rejected</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="accepted">Accepted</option>
            </select>

            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>

    );
};

const deleteDomo = async (id, onDeleted) => {
    const response = await fetch(`/deleteDomo`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (result.error) {
        helper.handleError(result.error);
    } else {
        onDeleted();
    }
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    const triggerReload = () => {
        if (typeof props.reloadDomos === 'function') {
            props.reloadDomos();
        } else {
            setDomos([]);
        }
    };

    const deleteAndUpdate = async (id) => {
        await deleteDomo(id, () => {
            setDomos(prev => prev.filter(d => d._id !== id));
        });
    };

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="jobTitle">Title: {domo.title}</h3>
                <h3 className="jobCompany">Company: {domo.company}</h3>
                <h3 className="jobPay">Pay: {domo.pay}</h3>
                <h3 className="jobType">Type: {domo.type}</h3>
                <h3 className="jobApplied">Applied: {domo.applied}</h3>
                <h3 className="jobStatus">Status: {domo.status}</h3>
                <button onClick={() => deleteAndUpdate(domo._id)}>Delete</button>
            </div>
        );
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;