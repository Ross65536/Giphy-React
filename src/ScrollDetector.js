import React from 'react';
import classNames from 'classnames';

class ScrollDetector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message:'not at bottom'
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.setState({
        message:'bottom reached'
      });
    } else {
      this.setState({
        message:'not at bottom'
      });
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return (
      <div>
        <div className="fixedDiv">{this.state.message}</div>
        <div className="scrollDiv"></div>
      </div>
    );
  }
}

ScrollDetector.propTypes = {
}

ScrollDetector.defaultProps = {
}

export default ScrollDetector;