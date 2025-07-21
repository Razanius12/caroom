export default function Loading() {
  return (
    <div className="content">
      <div className="container">
        <div className="text-center my-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}