import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from 'actions/actions';
import {store} from "app.jsx";


class SearchForm extends React.Component {
  showExamples(){
    const examples = this.props.examples;
    return examples.map(example =>
      <li key={example.description}>
        <a className="custom-link" onClick={() => this.exampleSequence(example.sequence)}>{example.description}</a>
        <small>{!!(example.urs) ? ` (${example.urs})` : " "}</small>
      </li>)
  }

  exampleSequence(sequence) {
    store.dispatch(actionCreators.onExampleSequence(sequence));
    store.dispatch(actionCreators.onSubmit(sequence, this.props.databases));
  }

  onSubmit(event) {
    event.preventDefault();
    const state = store.getState();

    // split the sequence for batch queries and set a limit on the number of queries
    if (state.fileUpload && state.sequence) {
      let getSequence = state.sequence.split(/(?=>)/g).slice(0, 50);
      store.dispatch(actionCreators.onMultipleSubmit(getSequence, this.props.databases));
    } else if (state.sequence && state.sequence.match("^([0-9a-fA-F]{8})-(([0-9a-fA-F]{4}\\-){3})([0-9a-fA-F]{12})$")) {
      store.dispatch(actionCreators.updateJobId(state.sequence));
    } else if (state.sequence && (state.sequence.length < 10 || state.sequence.length > 7000)) {
      store.dispatch(actionCreators.invalidSequence());
    } else if (state.sequence) {
      store.dispatch(actionCreators.onSubmit(state.sequence, this.props.databases));
    }

    state.sequence = "";
  }

  render() {
    const searchButtonColor = this.props.customStyle && this.props.customStyle.searchButtonColor ? this.props.customStyle.searchButtonColor : "";
    const clearButtonColor = this.props.customStyle && this.props.customStyle.clearButtonColor ? this.props.customStyle.clearButtonColor : "#6c757d";
    const uploadButtonColor = this.props.customStyle && this.props.customStyle.uploadButtonColor ? this.props.customStyle.uploadButtonColor : "";
    const hideUploadButton = this.props.customStyle && this.props.customStyle.hideUploadButton && this.props.customStyle.hideUploadButton === "true" ? "none" : "initial";
    return (
      <div className="rna">
        <div className="row">
          <div className="col-sm-12">
            { this.props.databases.length === 0 ? '' : <small><img src={'https://rnacentral.org/static/img/logo/rnacentral-logo.png'} alt="RNAcentral logo" style={{width: "1%", verticalAlign: "text-top"}}/> Powered by <a className="custom-link" style={{marginRight: "7px"}} target='_blank' href='https://rnacentral.org/'>RNAcentral</a>|</small>}
            <small style={{marginLeft: "7px"}}>Local alignment using <a target='_blank' className="custom-link" href='https://www.ncbi.nlm.nih.gov/pubmed/23842809'>nhmmer</a></small>
          </div>
        </div>
        <form onSubmit={(e) => this.onSubmit(e)}>
          <div className="row mt-1">
            <div className="col-sm-9">
              <textarea className="form-control" id="sequence" name="sequence" rows="7" value={this.props.sequence} onChange={(e) => this.props.onSequenceTextareaChange(e)} placeholder="Enter RNA/DNA sequence (with an optional description in FASTA format) or job id" />
            </div>
            <div className="col-sm-3">
              <button className="btn btn-primary mb-2" style={{background: searchButtonColor}} type="submit" disabled={!this.props.sequence ? "disabled" : ""}>Search</button><br />
              <button className="btn btn-secondary mb-2" style={{background: clearButtonColor}} type="submit" onClick={ this.props.onClearSequence } disabled={!this.props.sequence ? "disabled" : ""}>Clear</button><br />
              <div style={{display: hideUploadButton}}>
                <label htmlFor="file-upload" className="custom-file-upload" style={{background: uploadButtonColor}}>Upload file</label>
                <input id="file-upload" type="file" accept=".fasta" onClick={ this.props.onClearSequence } onChange={this.props.onFileUpload} />
                <div className="row"><small>Up to 50 queries</small></div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-9">
              {this.props.examples ? <div id="examples"><ul>Examples: {this.showExamples()}</ul></div> : ""}
            </div>
          </div>
          {
            this.props.submissionError && (
              <div className="row">
                <div className="col-sm-9">
                  <div className="alert alert-danger">
                    <h3>Form submission failed</h3>
                    { this.props.submissionError }
                  </div>
                </div>
              </div>
            )
          }
          {
            this.props.status === "invalidSequence" && (
              <div className="row">
                <div className="col-sm-9">
                  <div className="alert alert-warning">
                    {this.props.sequence.length < 10 ? <p>The sequence cannot be shorter than 10 nucleotides</p> : <p>The sequence cannot be longer than 7000 nucleotides</p>}
                  </div>
                </div>
              </div>
            )
          }
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  status: state.status,
  infernalStatus: state.infernalStatus,
  sequence: state.sequence,
  hits: state.hits,
  entries: state.entries,
  facets: state.facets,
  hitCount: state.hitCount,
  ordering: state.ordering,
  textSearchError: state.textSearchError,
  infernalEntries: state.infernalEntries,
  fileUpload: state.fileUpload,
  exactMatch: state.exactMatch,
});

const mapDispatchToProps = (dispatch) => ({
  onSequenceTextareaChange: (event) => dispatch(actionCreators.onSequenceTextAreaChange(event)),
  onClearSequence: () => dispatch(actionCreators.onClearSequence()),
  onFileUpload: (event) => dispatch(actionCreators.onFileUpload(event))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm);
