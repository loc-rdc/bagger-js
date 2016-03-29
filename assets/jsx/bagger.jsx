import React from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as BagActions from '../js/actions';

import SelectFiles from '../jsx/selectfiles.jsx';
import Dashboard from '../jsx/dashboard.jsx';
import Bag from '../jsx/bag.jsx';
import ServerInfo from '../jsx/server-info.jsx';
import WorkerPool from '../js/worker-pool';

class Bagger extends React.Component {

    componentDidMount() {
        const { dispatch } = this.props
        const b = document.getElementById('bagger');
        const dataset = b.dataset
        const args = [dataset.accessKeyId, dataset.secretAccessKey, dataset.bucket, dataset.region,
                        dataset.keyPrefix]
        if (args.some(arg => arg !== undefined)) {
            dispatch(BagActions.updateConfig(...args))
        }
        dispatch(BagActions.testConfiguration())
        setInterval(() => dispatch(BagActions.updateThroughput()), 1000)
        const hasher = new WorkerPool('hash-worker.js', 4, (fullPath, hashed) => {
            dispatch(BagActions.updateBytesHashed(fullPath, hashed))
        }, (hasherStats) => dispatch(BagActions.updateHasherStats(hasherStats))
        )
        this.hasher = hasher;
    }

    render() {
        const {dispatch, bagger, hasher, uploader} = this.props;
        const actions = bindActionCreators(BagActions, dispatch);

        return (
            <div className="bagger">
                <ServerInfo
                    uploader={uploader}
                    updateConfig={actions.updateConfig}
                    testConfiguration={actions.testConfiguration}
                />
                {uploader.configStatus.message === 'OK' && (
                    <div>
                        <SelectFiles onFilesChange={(files) => {
                            dispatch(BagActions.addFiles(files))
                            Promise.all([...files].map(([fullPath, file]) => this.hasher.hash({
                                file,
                                fullPath,
                                'action': 'hash'
                            }).then(result => {
                                dispatch(BagActions.updateHash(fullPath, result.data.sha256))
                                dispatch(BagActions.upload(fullPath, file, file.size, file.type,
                                uploader.bucket, uploader.keyPrefix))
                            }).catch(function (error) {
                                throw error
                            })
                            ));
                        }}
                        />
                        {bagger.files.size > 0 && (
                            <Dashboard
                                bagger={bagger}
                                hasher={hasher}
                                uploader={uploader}
                            />
                        )}
                        {bagger.files.size > 0 && bagger.files.size === bagger.hashes.size && (
                            <Bag bagger={bagger} />
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default connect(state => state)(Bagger)
