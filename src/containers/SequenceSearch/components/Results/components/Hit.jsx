import React from 'react';
import {connect} from "react-redux";

import * as actionCreators from 'actions/actions';


class Hit extends React.Component {
  render() {
    const database = this.props.databases;
    let seqTitleStyle = {
      color: this.props.customStyle && this.props.customStyle.seqTitleColor ? this.props.customStyle.seqTitleColor : "",
      fontSize: this.props.customStyle && this.props.customStyle.seqTitleSize ? this.props.customStyle.seqTitleSize : "20px",
    };
    let seqInfoStyle = {
      color: this.props.customStyle && this.props.customStyle.seqInfoColor ? this.props.customStyle.seqInfoColor : "",
      fontSize: this.props.customStyle && this.props.customStyle.seqInfoSize ? this.props.customStyle.seqInfoSize : "",
    };
    return (
      <li>
        <a className="custom-link" style={seqTitleStyle} href={`https://www.ncbi.nlm.nih.gov/nuccore/${this.props.entry.rnacentral_id}`} target='_blank'>
          {this.props.entry.description}
        </a>
        {database.length === 0 && <div className="mt-2" style={seqInfoStyle}>{ this.props.entry.rnacentral_id }</div>}
        {database.length === 0 ? '' : <div className="mt-2" style={seqInfoStyle}>{this.props.entry.target_length} nucleotides</div>}
        <div className={this.props.detailsCollapsed ? 'detail-collapsed' : 'mt-1'}>
          <span className="detail">E-value: { this.props.entry.e_value }</span>
          <span className="detail">Identity: { `${parseFloat(this.props.entry.identity).toFixed(2)}%`}</span>
          <span className="detail">Query coverage: { `${parseFloat(this.props.entry.query_coverage).toFixed(2)}%` }</span>
          <span className="detail">Target coverage: { `${parseFloat(this.props.entry.target_coverage).toFixed(2)}%`}</span>
          <span className="detail">Gaps: { `${parseFloat(this.props.entry.gaps).toFixed(2)}%` }</span>
        </div>
        <div className={`alignment ${this.props.alignmentsCollapsed ? 'alignment-collapsed' : ''}`}>
          <p>{this.props.entry.alignment}</p>
        </div>
      </li>
    )
  }
}

function mapStateToProps(state) {
  return {
    status: state.status,
    sequence: state.sequence,
    entries: state.entries,
    facets: state.facets,
    selectedFacets: state.selectedFacets,
    hitCount: state.hitCount,
    ordering: state.ordering,
    textSearchError: state.textSearchError,
    alignmentsCollapsed: state.alignmentsCollapsed,
    detailsCollapsed: state.detailsCollapsed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onToggleAlignmentsCollapsed: () => dispatch(actionCreators.onToggleAlignmentsCollapsed()),
    onToggleDetailsCollapsed: () => dispatch(actionCreators.onToggleDetailsCollapsed()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hit);