import React, {memo} from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as MedicineService from "../../services/Medicine"
import MedicineComponent from "../../components/MedicineComponent/MedicineComponent";
import { WrapperBoLoc, WrapperChuDoiTuongSuDung, WrapperDoiTuongSuDung, WrapperFilter, WrapperIcon, WrapperKhungBen, WrapperKhungBenBenTrong, WrapperKhungChinh, WrapperKhungDuoiBoLoc, WrapperNutDoiTuongSuDung, WrapperPhanLoaiDoiTuongSuDung, WrapperPhanLoaiDoiTuongSuDungA} from "./style"
import MedicineSearchComponent from "../../components/MedicineSearchComponent/MedicineSearchComponent"
import { Checkbox } from "antd";

function MedicalEquipment(){
  const [isOpen, setIsOpen] = useState(false);
  const [filteredMedicine, setFilteredMedicine] = useState([]);
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [updatedTypes, setUpdatedTypes] = useState([]);

  const handleTypeCheckboxChange = (type) => {
    setSelectedTypes(prevSelectedTypes => {
      const updatedTypes = prevSelectedTypes.includes(type)
          ? prevSelectedTypes.filter(t => t !== type)
          : [...prevSelectedTypes, type];
      console.log("Updated types:", updatedTypes);
      return updatedTypes;
    });
  };

  const searchMedicine = useSelector((state) => state?.medicine?.search);
  const searchDebounce = useDebounce(searchMedicine, 500);
  const [loading, setLoading] = useState(false);
  
  const [limit, setLimit] = useState(3);
  const [typeProducts, setTypeProducts] = useState([]);

  // const fetchMedicineAll = async () => {
  //   const res = await MedicineService.getAllMedicine();
  //   if (res?.status === "OK") {
  //     let filteredMedicines = res?.data;
  //     // If there are selected types, filter the medicines
  //     if (selectedTypes.length > 0) {
  //       filteredMedicines = res?.data.filter(medicine => selectedTypes.includes(medicine.type));
  //     }
  //     setFilteredMedicine(filteredMedicines);
  //   }
  // };

  const fetchMedicineAll = async () => {
    const res = await MedicineService.getAllMedicine(limit); // Pass limit to your service function
    if (res?.status === "OK") {
      let filteredMedicines = res?.data;
      // If there are selected types, filter the medicines
      if (selectedTypes.length > 0) {
        filteredMedicines = res?.data.filter(medicine => selectedTypes.includes(medicine.type));
      }
      setFilteredMedicine(filteredMedicines);
    }
  };
  
  

  const fetchAllTypeProduct = async () => {
    const res = await MedicineService.getAllTypeMedicine();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  // const {
  //   isLoading,isLoadingFiltered,
  //   data: medicine,
  //   isPreviousData,
  // } = useQuery(["medicine", limit, searchDebounce], fetchMedicineAll, 
  //   async (context) => {
  //     const limit = context?.queryKey && context?.queryKey[1];
  //     const search = context?.queryKey && context?.queryKey[2];
  //     const res = await MedicineService.getAllMedicine(search, limit);
  //   },
  //   {
  //   retry: 3,
  //   retryDelay: 1000,
  //   keepPreviousData: true,
  // });

  const {
    isLoading,isLoadingFiltered,
    data: medicine,
    isPreviousData,
  } = useQuery(["medicine", limit, searchDebounce], fetchMedicineAll, 
    async (context) => {
      const limit = context?.queryKey && context?.queryKey[1];
      const search = context?.queryKey && context?.queryKey[2];
      const res = await MedicineService.getAllMedicine(search, limit); // Pass limit to your service function
    },
    {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });
  

  useEffect(() => {
    fetchAllTypeProduct();
  }, [medicine, selectedTypes]);
  
  useEffect(() => {
    fetchMedicineAll();
  }, [selectedTypes]);
  
  // useEffect(() => {
  //   if (selectedTypes.length > 0 && medicine?.data) {
  //     const filteredMedicine = medicine.data.filter(med => selectedTypes.includes(med.type));
  //     setFilteredMedicine(filteredMedicine);
  //   } else {
  //     // Nếu không có loại được chọn, hiển thị tất cả sản phẩm
  //     setFilteredMedicine(medicine?.data || []);
  //   }
  // }, [medicine, selectedTypes]);

  useEffect(() => {
    if (selectedTypes.length > 0 && medicine?.data) {
      const filteredMedicine = medicine.data.filter(med => selectedTypes.includes(med.type));
      setFilteredMedicine(filteredMedicine);
    } else {
      // If no type is selected, set filteredMedicine to all medicines
      setFilteredMedicine(medicine?.data || []);
    }
  }, [medicine, selectedTypes]);
  

  {isLoading && <div>Loading...</div>}

  const loadMore = () => {
    setLimit(prevLimit => prevLimit + 3); // Increase limit by 3 each time
  };
  
    return (
      <section className="blogs" id="blogs">
      <h1 className="heading">
        {" "}
        THÔNG TIN <span>THUỐC</span>{" "}
      </h1>
      <MedicineSearchComponent/> 
      <WrapperKhungChinh>
        <WrapperKhungBen style={{backgroundColor:'white'}}>
         <WrapperKhungBenBenTrong>
           <div className="BolocNangcao"  style={{color: 'var(--gray-1000)',
  paddingTop: '.75rem',
  paddingBottom: '.5rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  borderColor: 'var(--gray-200)',
  borderBottomWidth: '5px',
  alignItems: 'center', 
  display: 'flex',
  borderRadius: '10px',}}>
             <WrapperIcon>
               <svg>
                 <path d="M10 16H14C14.5523 16 15 16.4477 15 17C15 17.5128 14.614 17.9355 14.1166 17.9933L14 18H10C9.44772 18 9 17.5523 9 17C9 16.4872 9.38604 16.0645 9.88338 16.0067L10 16H14H10ZM8 11H16C16.5523 11 17 11.4477 17 12C17 12.5128 16.614 12.9355 16.1166 12.9933L16 13H8C7.44772 13 7 12.5523 7 12C7 11.4872 7.38604 11.0645 7.88338 11.0067L8 11H16H8ZM5 6H19C19.5523 6 20 6.44772 20 7C20 7.51284 19.614 7.93551 19.1166 7.99327L19 8H5C4.44772 8 4 7.55228 4 7C4 6.48716 4.38604 6.06449 4.88338 6.00673L5 6H19H5Z" fill="currentColor"></path>
               </svg>
             </WrapperIcon>
             <h3 className="css-jey85n">Bộ lọc nâng cao</h3>
           </div>
           <WrapperKhungDuoiBoLoc>
             <WrapperDoiTuongSuDung>
             <WrapperChuDoiTuongSuDung>
                <div className="dropdown-relative" style={{display:"flex", justifyContent:"space-between"}}>
                  <p className="loai-thuoc" style={{flex: "0 0 auto"}}>Loại thuốc</p>
                  <div className="Button" style={{flex: "0 0 auto", cursor:"pointer"}}>
                  <button type="button" onClick={handleToggleDropdown} className="dropdown-toggle" style={{justifyContent:"right",cursor: "pointer"}}>
                    <svg
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      className={`transition-[transform] rotate-${isOpen ? 180 : 0}`}
                    >
                      <path d="M5.25383 8.29289C5.64435 7.90237 6.27752 7.90237 6.66804 8.29289L12.9609 14.5858L19.2538 8.29289C19.6444 7.90237 20.2775 7.90237 20.668 8.29289C21.0586 8.68342 21.0586 9.31658 20.668 9.70711L13.668 16.7071C13.2775 17.0976 12.6444 17.0976 12.2538 16.7071L5.25383 9.70711C4.86331 9.31658 4.86331 8.68342 5.25383 8.29289Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  </div>
                </div>

                {isOpen && (
                  <div className={`dropdown-content ${isOpen ? 'dropdown-content-open' : ''}`}>
                     <WrapperBoLoc>
                     {typeProducts.map((type) => (
                      <Checkbox
                        key={type}
                        onChange={() => handleTypeCheckboxChange(type)}
                        checked={selectedTypes.includes(type)}
                      >
                        {type}
                      </Checkbox>
                    ))}
                    </WrapperBoLoc>
                  </div>
                )}
              </WrapperChuDoiTuongSuDung>
             </WrapperDoiTuongSuDung>
           </WrapperKhungDuoiBoLoc>
         </WrapperKhungBenBenTrong>
       </WrapperKhungBen> 
       <div> 
       <div className="box-container">
       {filteredMedicine.map((medicine) => {
            return (
              <MedicineComponent
                name={medicine.name}
                price={medicine.price}
                description={medicine.description}
                selled={medicine.selled}
                countInStock={medicine.countInStock}
                image={medicine.image}
                type={medicine.type}
              />
            );
          })};
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={loadMore} style={{
          border: '2px solid green',
          borderRadius: '5px',
          padding: '10px 20px',
          color: 'green',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'green';
          e.currentTarget.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'green';
        }}
        >
          Load More
        </button>
      </div>
      </div>
      </WrapperKhungChinh>
      
    </section>
);   
}
export default MedicalEquipment;