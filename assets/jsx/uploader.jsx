import React from 'react'
import filesize from 'filesize'

class Uploader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.files.size < 1) {
            return null;
        }
        var bytesUploaded = [...this.props.bytesUploaded.values()].reduce((r, n) => r + n, 0);

        var prettyBytesUploaded = filesize(bytesUploaded, {round: 0});

        // var time = this.state.times.valueSeq().reduce((r, n) => r + n, 0);
        var uploadBytesPerSecond = 0; // TODO: bytesUploaded / time || 0;
        var prettyUploadBytesPerSecond = filesize(uploadBytesPerSecond, {round: 1});

        var total = [...this.props.sizes.values()].reduce((r, n) => r + n, 0);

        var uploadComplete = (100 * (bytesUploaded / total)).toFixed(0);

        var completed = bytesUploaded === total;
        var active = completed === false;

        var res = ['progress-bar'];
        if (completed) {
            res.push('progress-bar-success');
        } else if (active > 0) {
            res = res.concat(['progress-bar-striped', 'active']);
        }
        var uploadProgressClasses = res.join(' ');

        return (
            <div className="col-sm-6 upload-stats">
                <h5>Uploads</h5>

                <div className="progress">

                    <div className={uploadProgressClasses} role="progressbar" aria-valuenow={uploadComplete} aria-valuemin="0" aria-valuemax="100" style={{
                        width: uploadComplete + '%'
                    }}
                    >
                        {uploadComplete}%
                    </div>
                </div>

                <p>Completed:
                    <code>{prettyBytesUploaded}</code>. Effective upload speed:
                    <code>{prettyUploadBytesPerSecond}</code>/s</p>

            </div>
        );
    }
}

Uploader.propTypes = {
    files: React.PropTypes.instanceOf(Map),
    hashes: React.PropTypes.instanceOf(Map),
    sizes: React.PropTypes.instanceOf(Map),
    bytesUploaded: React.PropTypes.instanceOf(Map)
}

export default Uploader;
