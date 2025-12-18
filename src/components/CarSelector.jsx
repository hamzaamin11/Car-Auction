import { useDispatch, useSelector } from "react-redux";
import {
  addMake,
  addModel,
  addSeries,
  addYear,
} from "./Redux/SelectorCarSlice";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

const CarSelector = ({ handleIsOpenToggle }) => {
  const { currentUser } = useSelector((state) => state?.auth);
  const selected = useSelector((state) => state.carSelector);
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const [carMake, setCarMake] = useState([]);
  const [carModel, setCarModel] = useState([]);
  const [carSeries, setCarSeries] = useState([]);

  // Brands list
  const carMakes = carMake.map((car) => ({
    label: car.brandName,
    value: car.id,
    counter: car?.vehicleCount,
  }));

  // Models list
  const carModels = carModel.map((car) => ({
    label: car.modelName,
    value: car.modelId, // 👈 store modelId
    counter: car.vehicleCount,
  }));

  // Series list
  const seriesList = carSeries.map((series) => ({
    label: series.seriesName,
    value: series.id,
  }));

  // Generate years
  const calcYearVal = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1970; i <= currentYear; i++) {
      years.unshift(i);
    }
    return years;
  };

  // API: Get all brands
  const handleGetAllMake = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getBrands/${currentUser?.role}`
      );
      setCarMake(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // API: Get models by brand
  const handleGetAllModelByMake = async (makeId) => {
    try {
      const res = await axios.get(`${BASE_URL}/getModelById/${makeId}`);
      setCarModel(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // API: Get series by model
  const handleGetAllSeriesByModel = async (modelId) => {
    try {
      const res = await axios.get(`${BASE_URL}/getSeriesById/${modelId}`);
      setCarSeries(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllMake();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-lg h-full rounded-lg">
      <div
        className=" flex items-end justify-end p-4 hover:cursor-pointer text-red-500"
        onClick={() => handleIsOpenToggle()}
      >
        X
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 border border-gray-200 h-[80vh] overflow-y-auto md:overflow-hidden">
        {/* Years */}
        {(activeStep === 0 || window.innerWidth >= 768) && (
          <div className="border-b md:border-r border-gray-200">
            <h3 className="bg-gray-100 p-3 font-bold">Model Year</h3>
            <div className="overflow-y-auto md:h-[60vh] h-auto">
              {calcYearVal().map((year) => (
                <div
                  key={year}
                  className={`p-3 cursor-pointer hover:bg-blue-50 ${
                    selected.year === year ? "bg-blue-100 font-medium" : ""
                  }`}
                  onClick={() => {
                    dispatch(addYear(year));
                    dispatch(addMake(""));
                    dispatch(addModel(""));
                    dispatch(addSeries(""));
                    setCarModel([]);
                    setCarSeries([]);
                    setActiveStep(1);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{year}</span>
                    <MdOutlineKeyboardArrowRight />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Makes */}
        {(activeStep === 1 || window.innerWidth >= 768) && (
          <div className="border-b md:border-r border-gray-200">
            <h3 className="bg-gray-100 p-3 font-bold">Make</h3>
            <div className="overflow-y-auto md:h-[60vh] h-auto">
              {selected?.year &&
                carMakes.map((make) => (
                  <div
                    key={make.value}
                    className={`p-3 cursor-pointer hover:bg-blue-50 ${
                      selected.make === make.label
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                    onClick={() => {
                      dispatch(addMake(make.label));
                      dispatch(addModel(""));
                      dispatch(addSeries(""));
                      setCarModel([]);
                      setCarSeries([]);
                      setActiveStep(2);

                      // ✅ Fetch models
                      handleGetAllModelByMake(make.value);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        <strong>({make.counter})</strong> {""}
                        {make.label}
                      </span>
                      <MdOutlineKeyboardArrowRight />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Models */}
        {(activeStep === 2 || window.innerWidth >= 768) && (
          <div className="border-b md:border-r border-gray-200">
            <h3 className="bg-gray-100 p-3 font-bold">Model</h3>
            <div className="overflow-y-auto md:h-[60vh] h-auto">
              {selected?.make &&
                carModels.map((model) => (
                  <div
                    key={model.value}
                    className={`p-3 cursor-pointer hover:bg-blue-50 ${
                      selected.model === model.label
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                    onClick={() => {
                      dispatch(addModel(model.label));
                      dispatch(addSeries(""));
                      setCarSeries([]);
                      setActiveStep(3);

                      // ✅ Fetch series
                      handleGetAllSeriesByModel(model.value);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        <strong>({model?.counter})</strong> {""}
                        {model.label}
                      </span>
                      <MdOutlineKeyboardArrowRight />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Series */}
        {(activeStep === 3 || window.innerWidth >= 768) && (
          <div className="border-b md:border-0 border-gray-200">
            <h3 className="bg-gray-100 p-3 font-bold">Version</h3>
            <div className="overflow-y-auto md:h-[60vh] h-auto">
              {selected?.model &&
                seriesList?.map((series) => (
                  <div
                    key={series.value}
                    className={`p-3 cursor-pointer hover:bg-blue-50 ${
                      selected.series === series.label
                        ? "bg-blue-100 font-medium"
                        : ""
                    }`}
                    onClick={() => {
                      dispatch(addSeries(series.label));
                      handleIsOpenToggle(""); // close modal
                    }}
                  >
                    {series.label}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Back & Done Buttons */}
      {window.innerWidth < 768 ? (
        <div className="flex justify-between p-4 mb-4 bg-gray-50">
          {/* Back Button (only if not on first step) */}
          {activeStep > 0 && (
            <button
              onClick={() => setActiveStep(activeStep - 1)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Back
            </button>
          )}
          {/* Done Button (only last step) */}
          {activeStep === 3 && (
            <button
              onClick={() => handleIsOpenToggle()}
              className="bg-blue-950 text-white px-6 py-2 rounded-md "
            >
              Done
            </button>
          )}
        </div>
      ) : (
        // Desktop Done Button (always visible)
        <div className="flex justify-center p-4 bg-gray-50">
          <button
            onClick={() => handleIsOpenToggle()}
            className="bg-blue-950 text-white px-6 py-2 rounded-md "
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default CarSelector;
