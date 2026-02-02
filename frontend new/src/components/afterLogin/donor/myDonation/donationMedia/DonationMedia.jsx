
import './DonationMedia.css';

function DonationMedia() {
    return (
        <div className="donation-media-section">
            <div className="mobile-frame">
                <div className="mobile-screen">
                    <div className="camera-view">
                        <div className="upload-zone">
                            <span className="upload-icon">📷</span>
                            <p>Drag and Drop</p>
                        </div>
                    </div>
                </div>

                <div className="mobile-controls">
                    <button className="media-btn gallery-btn">
                        <span className="icon">🖼️</span>
                    </button>
                    <button className="media-btn camera-btn">
                        <span className="icon">📷</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DonationMedia;
