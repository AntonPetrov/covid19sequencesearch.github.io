import * as types from './actionTypes';
import routes from 'services/routes.jsx';


export function toggleAlignmentsCollapsed() {
  return {type: types.TOGGLE_ALIGNMENTS_COLLAPSED };
}

export function fetchRNAcentralDatabases() {
  return function(dispatch) {
    return fetch(routes.rnacentralDatabases(), {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => dispatch({type: types.FETCH_RNACENTRAL_DATABASES, status: 'success', data: data}))
    .catch(error => dispatch({type: types.FETCH_RNACENTRAL_DATABASES, status: 'error', data: error}));
  }
}

export function onSubmit(sequence, selectedDatabases) {
  return function(dispatch) {
    fetch(routes.submitJob(), {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: sequence,
        databases: Object.keys(selectedDatabases).filter(key => selectedDatabases[key])
      })
    })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(data => dispatch({type: types.SUBMIT_JOB, status: 'success', data: data}))
    .catch(error => dispatch({type: types.SUBMIT_JOB, status: 'error', response: error}));
  }
}

export function fetchStatus(jobId) {
  return function(dispatch) {
    fetch(routes.jobStatus(), {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_id: jobId,
      })
    })
    .then(function(response) {
      if (response.ok) {
        return response.json()
      } else {
        throw response;
      }
    })
    .then((data) => {
      if (data.status === 'pending' || data.status === 'running') {
        let statusTimeout = setTimeout(store.dispatch(actions.fetchStatus(state.jobId)), 2000);
        dispatch({type: types.SET_STATUS_TIMEOUT, timeout: statusTimeout});
      }
    })
    .catch(error => {
      if (store.getState().hasOwnProperty('statusTimeout')) {
        store.getState().statusTimeout(); // clear status timeout
      }
      dispatch({type: types.FETCH_STATUS, status: 'error'})
    });
  }
}

// TODO: clear timeout when leaving the page !!!

export function fetchResults(jobId) {
  return function(dispatch) {
    fetch(routes.facetsSearch(jobId, buildQuery(), start, size, ordering), {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_id: jobId,
      })
    })
    .then(function(response) {
      if (response.ok) {
        return response.json()
      } else {
        throw response;
      }
    })
    .then(data => dispatch({type: types.FETCH_RESULTS, status: data.status}))  // TODO: improve this
    .catch(error => dispatch({type: types.FETCH_RESULTS, status: 'error'}));
  }
}

export function onSequenceTextAreaChange(event) {
  return {type: types.TEXTAREA_CHANGE, sequence: event.text}
}

export function onDatabaseCheckboxToggle(event) {
  return {type: types.TOGGLE_DATABASE_CHECKBOX, id: event.target.id}
}

export function onSelectAllDatabases() {
  return {type: types.SELECT_ALL_DATABASES}
}

export function onDeselectAllDatabases() {
  return {type: types.DESELECT_ALL_DATABASES}
}

export function onToggleDatabasesCollapsed() {
  return {type: types.TOGGLE_DATABASES_COLLAPSED}
}

export function onExampleSequence(sequence) {
  return {type: types.EXAMPLE_SEQUENCE, sequence: sequence}
}

export function onClearSequence() {
  return {type: types.CLEAR_SEQUENCE}
}

export function onFileUpload () {
  return function(dispatch) {
    let onFileUpload = function (event) {
      // TODO: fasta parsing
      // TODO: exception handling - user closed the dialog
      // TODO: exception handling - this is not a proper fasta file

      let fileReader = new FileReader();

      fileReader.onloadend = (event) => {
        let fileContent = event.target.result;
        dispatch();
        this.setState({sequence: fileContent});
      };

      fileReader.readAsText(event.target.files[0]);
    };
  }
  return {type: types.FILE_UPLOAD}
}