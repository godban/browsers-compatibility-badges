import React from 'react';
import ReactDOM from 'react-dom';

import Preview from './preview';

import {ReactComponent as IconMarkGithub} from '@primer/octicons/build/svg/mark-github.svg';
import {ReactComponent as IconCheck} from '@primer/octicons/build/svg/check.svg';
import {ReactComponent as IconX} from '@primer/octicons/build/svg/x.svg';
import {ReactComponent as IconChevronUp} from '@primer/octicons/build/svg/chevron-up.svg';
import {ReactComponent as IconChevronDown} from '@primer/octicons/build/svg/chevron-down.svg';

const buildLogoSrc = (name, size = '48x48') => `https://raw.githubusercontent.com/alrra/browser-logos/master/src/${name}/${name}_${size}.png`;

class Panel extends React.Component {
    constructor() {
        super();

        this.state = {
            browsers: [
                {
                    name: 'IE / Edge',
                    version: {
                        IE7: false,
                        IE8: false,
                        IE9: false,
                        IE10: false,
                        IE11: true,
                        Edge: true
                    },
                    img: buildLogoSrc('edge'),
                    support: true
                },
                {
                    name: 'Firefox',
                    version: 2,
                    img: buildLogoSrc('firefox'),
                    support: true
                },
                {
                    name: 'Chrome',
                    version: 2,
                    img: buildLogoSrc('chrome'),
                    support: true
                },
                {
                    name: 'Safari',
                    version: 2,
                    img: buildLogoSrc('safari'),
                    support: true
                },
                {
                    name: 'iOS Safari',
                    version: 2,
                    img: buildLogoSrc('safari-ios'),
                    support: true
                },
                {
                    name: 'Samsung',
                    version: 2,
                    img: buildLogoSrc('samsung-internet'),
                    support: true
                },
                {
                    name: 'Opera',
                    version: 2,
                    img: buildLogoSrc('opera'),
                    support: true
                },
                {
                    name: 'Opera Mini',
                    version: 2,
                    img: buildLogoSrc('opera-mini'),
                    support: false
                },
                {
                    name: 'Vivaldi',
                    version: 2,
                    img: buildLogoSrc('vivaldi'),
                    support: false
                },
                {
                    name: 'Yandex',
                    version: 2,
                    img: buildLogoSrc('yandex'),
                    support: false
                },
                {
                    name: 'Electron',
                    version: 2,
                    img: buildLogoSrc('electron'),
                    support: false
                }
            ],
        };

        this.handleBrowserSupportBound = this.handleBrowserSupport.bind(this);
        this.handleVersionChangeBound = this.handleVersionChange.bind(this);
        this.handleVersionVaryBound = this.handleVersionVary.bind(this);
        this.handleIEVersionsChangeBound = this.handleIEVersionsChange.bind(this);
    }

    isLastActive(arr, id) {
        let supportCounter = 0;

        arr.forEach((item) => {
            if (item.support) {
                supportCounter++;
            }
        });

        if (supportCounter === 1 && arr[id].support) {
            return true;
        }
    }

    handleVersionChange({target}) {
        const {browsers} = this.state;

        browsers[target.dataset.id].version = target.value;

        this.setState({
            browsers
        });
    }

    handleVersionVary(event) {
        const {target} = event;
        const {id} = target.dataset;
        const {browsers} = this.state;

        const btnDown = ReactDOM.findDOMNode(this.refs['btnDown' + id]);
        const btnUp = ReactDOM.findDOMNode(this.refs['btnUp' + id]);

        const VERSION_MAX = 10;

        if (target === btnUp) {
            if (browsers[id].version === 1) {
                btnDown.disabled = false;
            }
            if (browsers[id].version < VERSION_MAX) {
                browsers[id].version++;
            }
            if (browsers[id].version === VERSION_MAX) {
                target.disabled = true;
            }
        } else {
            if (browsers[id].version === VERSION_MAX) {
                btnUp.disabled = false;
            }
            if (browsers[id].version > 1) {
                browsers[id].version--;
            }
            if (browsers[id].version === 1) {
                target.disabled = true;
            }
        }

        this.setState({browsers: browsers});
    }

    handleBrowserSupport({target}) {
        const id = target.dataset.index;
        const {browsers} = this.state;

        if (this.isLastActive(browsers, id)) {
            return null;
        }

        browsers[id].support = !browsers[id].support;

        if (browsers[id].name === 'IE / Edge') {
            for (let key in browsers[id].version) {
                if (browsers[id].support) {
                    if (
                        key !== 'IE7'
                        && key !== 'IE8'
                        && key !== 'IE9'
                        && key !== 'IE10'
                    ) {
                        browsers[id].version[key] = true
                    }
                } else {
                    browsers[id].version[key] = false;
                }
            }
        }

        this.setState({browsers: browsers});
    }

    handleIEVersionsChange({target}) {
        const {key} = target.dataset;
        const {browsers} = this.state;
        let supportLength = 0;

        browsers[0].version[key] = !browsers[0].version[key];

        for (let supportKey in browsers[0].version) {
            if (browsers[0].version[supportKey]) supportLength++;
        }

        browsers[0].support = (supportLength !== 0);

        this.setState({browsers: browsers});
    }

    render() {
        const {browsers} = this.state;

        return (
            <div className='browsers__wrap'>
                <h1 className='main__title'>
                    Browsers support for README.md
                    <span className='main__sub-title'>
                        <IconMarkGithub className="icon icon--markGithub" />
                        <span className="octicon octicon-mark-github" /> GitHub Flavored Markdown
                    </span>
                </h1>
                <div className='browser__wrap'>
                    {browsers.map((item, index) => {
                        return (
                            <div
                                className='browser'
                                key={item.name}
                                disabled={!item.support}
                            >
                                <div className='browser__heading'>
                                    <input
                                        id={'check' + item.name}
                                        className='form__checkbox browser__checkbox'
                                        data-index={index}
                                        checked={item.support}
                                        onChange={this.handleBrowserSupportBound}
                                        type='checkbox'
                                    />
                                    <label
                                        className='browser__checkbox-label browser__title'
                                        htmlFor={'check' + item.name}
                                    >
                                        <IconCheck className="icon icon--check browser__checkbox-icon" />
                                        <IconX className="icon icon--cross browser__checkbox-icon" />
                                        <span className='browser__title-text'>{item.name}</span>
                                    </label>
                                </div>
                                {(item.name === 'IE / Edge') ?
                                    <div className='browser__control browser__control--ie'>
                                        {Object.keys(item.version).map(function (key) {
                                            return (
                                                <div className='browser__control-ie-version' key={key}>
                                                    <input
                                                        id={'check' + key}
                                                        className='form__checkbox browser__checkbox'
                                                        data-key={key}
                                                        checked={item.version[key]}
                                                        onChange={this.handleIEVersionsChangeBound}
                                                        type='checkbox'
                                                    />
                                                    <label
                                                        className='browser__checkbox-label browser__checkbox-label--small'
                                                        htmlFor={'check' + key}
                                                    >
                                                        <IconCheck
                                                            className="icon icon--check browser__checkbox-icon"
                                                        />
                                                        <IconX className="icon icon--cross browser__checkbox-icon" />
                                                        {key}
                                                    </label>
                                                </div>
                                            );
                                        }, this)}
                                    </div>
                                    :
                                    <div className='browser__control'>
                                        last
                                        <input
                                            className='form__input form__input--text form__input--no-spinners'
                                            data-id={index}
                                            onChange={this.handleVersionChangeBound}
                                            value={item.version}
                                            max='10'
                                            type='number'
                                        />
                                        <button
                                            className='btn btn--text btn-up'
                                            data-id={index}
                                            ref={'btnUp' + index}
                                            onClick={this.handleVersionVaryBound}
                                            type='button'
                                        >
                                            <IconChevronUp className="icon" />
                                        </button>
                                        <button
                                            className='btn btn--text btn-down'
                                            data-id={index}
                                            ref={'btnDown' + index}
                                            onClick={this.handleVersionVaryBound}
                                            type='button'
                                        >
                                            <IconChevronDown className="icon" />
                                        </button>
                                    </div>}
                            </div>
                        );
                    }, this)}
                    <span className='pointer'>&#10549;</span>
                </div>
                <Preview browsers={browsers} />
            </div>
        );
    };
}

export default Panel;
