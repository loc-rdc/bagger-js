var React = require('react/addons'),
    filesize = require('filesize');

class Dashboard extends React.Component {
    render() {
        var files = this.props.files,
            hashWorkers = this.props.hashWorkers,
            uploadWorkers = this.props.uploadWorkers;

        if (files.total < 1) {
            return null;
        }

        var hashComplete = (100 * (1 - (hashWorkers.pendingFiles / files.total))).toFixed(0),
            // Yay insufficient magic: this has to be done at a distance because the JSX parser forces style to be an object but can't declare one inline:
            hashCompleteStyle = {width: hashComplete + '%'},
            hashBytesPerSecond = hashWorkers.totalBytes / hashWorkers.totalTime || 0,
            hashSpeed = filesize(hashBytesPerSecond, {round: 1}),
            uploadComplete = (100 * (1 - (uploadWorkers.pendingFiles / files.total))).toFixed(0),
            uploadCompleteStyle = {width: uploadComplete + '%'},
            uploadBytesPerSecond = uploadWorkers.totalBytes / uploadWorkers.totalTime || 0,
            uploadSpeed = filesize(uploadBytesPerSecond, {round: 1});

            var hashProgressClasses = 'progress-bar',
                uploadProgressClasses = 'progress-bar';

            if (hashWorkers.active > 0) {
                hashProgressClasses += ' progress-bar-striped active';
            } else if (hashWorkers.totalBytes > 0) {
                hashProgressClasses += ' progress-bar-success';
            }

            if (uploadWorkers.active > 0) {
                uploadProgressClasses += ' progress-bar-striped active';
            }

        return (
            <div className="dashboard well well-sm clearfix">
                <div className="col-sm-2 file-stats">
                    <h5>Files</h5>
                    <span className="text-right">
                        <output>{files.total.toLocaleString()}</output>
                        <output>{filesize(files.size)}</output>
                    </span>
                </div>
                <div className="col-sm-5 hash-stats">
                    <h5>Hashing</h5>
                    <div className="progress">
                        <div className={hashProgressClasses} role="progressbar" aria-valuenow="{hashComplete}" aria-valuemin="0" aria-valuemax="100" style={hashCompleteStyle}>
                            {hashComplete}%
                        </div>
                    </div>

                    <p>{hashWorkers.active} / {hashWorkers.total} active</p>
                    <p>Throughput: {hashSpeed}/s</p>
                </div>
                <div className="col-sm-5 upload-stats">
                    <h5>Uploads</h5>

                    <div className="progress">
                        <div className={uploadProgressClasses} role="progressbar" aria-valuenow="{uploadComplete}" aria-valuemin="0" aria-valuemax="100" style={uploadCompleteStyle}>
                            {uploadComplete}%
                        </div>
                    </div>

                    <p>{uploadWorkers.active} / {uploadWorkers.total} active</p>
                    <p>Throughput: {uploadSpeed}/s</p>
                </div>
            </div>
        );
    }
}

export { Dashboard };
