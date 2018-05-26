import React, { Component } from 'react';

import './App.css'

// for ajax
import $ from 'jquery';

const GIPHY_SEARCH = 'https://api.giphy.com/v1/gifs/search';

function appendURIObject(url, object) {
    return url + "?" + $.param(object);
}

class GifCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bBookmarked: props.bContainsBookmark,
        };

        this.toggleBookmark = this.toggleBookmark.bind(this);

    }

    toggleBookmark(event) {
        const bMarked = !this.props.toggleBookmark(this.props.giphy);
        this.setState({
            ...this.state,
            bBookmarked: bMarked,
        });
        event.preventDefault();
    }

    render() {
        let bookMarkIcon = this.state.bBookmarked ? <i className="fas fa-bookmark fa-2x"></i> : <i className="far fa-bookmark fa-2x"></i>;

        return (
            <div className="card">
                <a href={this.props.giphy.bitly_url}>
                <img className="card-img-top" src={this.props.giphy.images.downsized.url} alt="card gif" />
                </a>
                <a href="/" className="btn btn-primary card-button" onClick={this.toggleBookmark}>
                    {bookMarkIcon}
                </a>
            </div>

        );
    }
}

class GifIndex extends Component {


    render() {
        const giphyObjects = this.props.gifs;
        let cards = giphyObjects.map((
            image => <GifCard key={image.id} giphy={image} toggleBookmark={this.props.toggleBookmark} bContainsBookmark={this.props.containsBookmark(image)} />
        ));

        return (
            <div className="card-columns">
                {cards}
            </div>
        );
    }
}

const BOOKMARKS_NAME = "giphy-bookmarks";


class BookmarkButton extends Component {
    render() {

        let bookmarkIcon = <span className="xs-to-sm"> { this.props.bBookmarksOpen ? <i className="fas fa-book-open"></i> : <i className="fas fa-book"></i> } </span>;

        let bookmarksSuffix = this.props.bookmarksLength;
        bookmarksSuffix = bookmarksSuffix === 0 ? "" : ` (${bookmarksSuffix})`;
        let bookmarksPrefix = this.props.bBookmarksOpen ? "Close " : "Open ";

        const bookmarkButtonColor = this.props.bBookmarksOpen ? "btn-primary" : "btn-secondary";

        return (
            <button type="button" className={`btn ${bookmarkButtonColor}`} onClick={this.props.toggleBookmarksPage}>
                <span className="superfluous-text">
                    {bookmarksPrefix}
                    Bookmarks
                </span>
                {bookmarkIcon}
                {bookmarksSuffix}
            </button>
        );

    }
}

const RESULTS_PER_PAGE = 12;

class MainPage extends Component {

    constructor(props) {
        super(props);

        const bookmarks = this.restoreBookmarks();
        this.state = {
            searchText: '',
            gifs: [],
            bookmarks: bookmarks,
            bBookmarksOpen: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.containsBookmark = this.containsBookmark.bind(this);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.indexOfBookmark = this.indexOfBookmark.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    restoreBookmarks() {
        const storedJSON = window.localStorage.getItem(BOOKMARKS_NAME);
        if (storedJSON == null)
            return [];
        else
            return JSON.parse(storedJSON);

    }

    saveBookmarksState() {
        localStorage.setItem(BOOKMARKS_NAME, JSON.stringify(this.state.bookmarks));
    }

    indexOfBookmark(obj) {
        const bookmarks = this.state.bookmarks;

        for (let i = 0; i < bookmarks.length; i++) {
            const bookmark = bookmarks[i];
            if (bookmark.id === obj.id)
                return i;
        }

        return -1;
    }

    containsBookmark(obj) {
        const bValue = this.indexOfBookmark(obj) >= 0;

        return bValue;
    }

    toggleBookmark(obj) {
        let modBookmarks = this.state.bookmarks.slice();
        const index = this.indexOfBookmark(obj);
        const bExists = index >= 0;
        if (bExists)
            modBookmarks.splice(index, 1); //remove
        else
            modBookmarks.push(obj);

        this.setState({
            ...this.state,
            bookmarks: modBookmarks
        }, this.saveBookmarksState);



        return bExists;
    }

    searchRequest(sucessCallback = () => { }, offset = 0, maxNumResults = RESULTS_PER_PAGE) {
        

        let searchData = {
            'api_key': 'iXiRTapoKR9zI25YGOU1tJGIAx8JrTr8',
            'q': this.state.searchText,
            'limit': maxNumResults,
            'offset': offset,
        };
        const requestURL = appendURIObject(GIPHY_SEARCH, searchData);

        $.ajax({
            url: requestURL,
            type: "GET",
            dataType: "json",
            success: (responseObj) => sucessCallback(responseObj),
            error: function (xhr, ajaxOptions, thrownError) {
                alert("An error occured");
            }
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setBookmarksOpen(false);

        const callback = (responseObj) => {
            const dataArr = responseObj.data;

            console.log(dataArr);

            this.setState({
                ...this.state,
                gifs: dataArr
            });
        }

        this.searchRequest(callback);

    }

    handleSearchChange(event) {
        this.setState({
            ...this.state,
            searchText: event.target.value
        });
        event.preventDefault();
    }

    getBody() {
        if (this.state.bBookmarksOpen)
            return <GifIndex gifs={this.state.bookmarks} toggleBookmark={this.toggleBookmark} containsBookmark={this.containsBookmark} />;
        else
            return <GifIndex gifs={this.state.gifs} toggleBookmark={this.toggleBookmark} containsBookmark={this.containsBookmark} />;
    }

    setBookmarksOpen(bOpen) {
        this.setState({
            ...this.state,
            bBookmarksOpen: bOpen
        });
    }

    toggleBookmarksPage() {
        const neg = !this.state.bBookmarksOpen;
        this.setBookmarksOpen(neg);
    }

    loadMore(e) {
        e.preventDefault();

        const offset = this.state.gifs.length;
        
        let callback = (responseObj) => {
            const dataArr = responseObj.data;

            const joinedGifs = this.state.gifs.concat(dataArr);
            this.setState({
                ...this.state,
                gifs: joinedGifs
            });
        }
        callback = callback.bind();


        this.searchRequest(callback, offset);
    }

    render() {

        let loadMoreButton = "";
        if (this.state.gifs.length !== 0 && ! this.state.bBookmarksOpen) {
            loadMoreButton =
                <div className="d-flex justify-content-center w-100 mt-4 mb-5">
                    <a href="/" className="btn btn-primary" onClick={this.loadMore}>
                        Load More
                </a>
                </div>
        }


        return (
            <div>
                {/* Header */}
                <nav className="navbar navbar-light bg-light justify-content-between sticky-top">
                    <a className="navbar-brand"><b className="responsive-breakable">Giphy-Marks</b></a>
                    <form className="form-inline" id="header-search" role="search" onSubmit={this.handleSubmit}>
                        <input id="search-input" type="text" className="form-control" placeholder="Search" onChange={this.handleSearchChange} />
                        <button type="submit" className="btn btn-default">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>
                    <BookmarkButton bBookmarksOpen={this.state.bBookmarksOpen} bookmarksLength={this.state.bookmarks.length} toggleBookmarksPage={this.toggleBookmarksPage.bind(this)} />
                </nav>

                {/* Body */}
                <div id="body" className="container mt-3 w-100">
                    {this.getBody()}

                </div>
                {loadMoreButton}
            </div>
        );
    }
}



export default MainPage;