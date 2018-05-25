import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Page extends React.Component {

    render() {

        return (
        <p> HI </p>
        );
    }
}

ReactDOM.render(
    <Page />,
    document.getElementById('root')
);