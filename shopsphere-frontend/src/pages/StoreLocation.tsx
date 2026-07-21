import SubNav from "../components/SubNav";

const StoreLocation = () => {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SubNav />

        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Our Store Locations</h1>
          <p className="text-lg text-slate-600">
            Store location information is not yet configured. Add real store entries through the backend to display available locations.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8 border border-slate-200">
          <p className="text-slate-600">
            Currently there are no store locations available. Once store data is added to the database, this page will show real locations and contact details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreLocation;

