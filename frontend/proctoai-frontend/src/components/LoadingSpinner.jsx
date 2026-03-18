const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
      </div>
    );
  }
  return <div className="spinner spinner-sm"></div>;
};

export default LoadingSpinner;
