import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  SHOW_INFO,
  HIDE_INFO,
  CHANGE_LANGUAGE,
} from '../redux/actions/actions.js';
import { LANGUAGE } from '../redux/thunks/changeLanguage';
import { Container } from '../style/info';
import { Title, Subtitle, Body, Button, Top } from '../style/common';
import ReactMarkdown from 'react-markdown';
import { mapStateToProps } from '../redux/mapStateToProps';

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      SHOW_INFO,
      HIDE_INFO,
      CHANGE_LANGUAGE,
    },
    dispatch,
  ),
  language: () => dispatch(LANGUAGE()),
});
class Info extends Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <Container info={this.props.info.status}>
        <Top>
          <Button
            onTouchStart={this.props.actions.HIDE_INFO}
            onPointerDown={this.props.actions.HIDE_INFO}
          >
            x
          </Button>
        </Top>
        <Title>{this.props.info.Title}</Title>
        <Subtitle>{this.props.info.Subtitle}</Subtitle>
        <Body>
          <ReactMarkdown source={this.props.info.Body} escapeHtml={false} />
        </Body>
      </Container>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Info);
