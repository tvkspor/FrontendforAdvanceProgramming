import React from "react";
import {
    WrapperDoctorsBoxContainer, WrapperDoctorsBoxContainerBox, WrapperDoctorsBoxContainerBoxImg,
    WrapperDoctorsBoxContainerBoxH3, WrapperDoctorsBoxContainerBoxSpan, WrapperDoctorsBoxContainerBoxShare,
    WrapperDoctorsBoxContainerBoxShareA
} from "./style";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import doc_1 from "../../assets/images/doc_1.jpg";
import {
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
    LinkedinOutlined,
} from "@ant-design/icons";
import {
    faChevronRight,

} from "@fortawesome/free-solid-svg-icons";
import moment from 'moment'

const DoctorCardComponent = (props) => {
    const {
        name,
        phone,
        address,
        avatar,
        sex,
        dateofbirth,
        department
    } = props;
    const navigate = useNavigate();
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`);
    };
    return (
        <div className="box">
          <div className="image">
            <img src={avatar} alt="" style={{width: "100%", height: "20rem", objectFit: "contain"}}/>
          </div>
          <div className="content">
            <h3>{name}</h3>
            {/* <p>Lorem, ipsum dolor.</p> */}
            <ul style={{listStyleType: 'disc'}}>
              {/* <li>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p>Tình trạng</p>
                  <p style={{backgroundColor: '#FFAAAA', borderRadius: '10px', color: 'red', fontWeight: 'bold', padding: '10px'}}>{availability}</p>
                </div>
              </li> */}
              <li>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p>Số điện thoại</p>
                  <p style={{color: 'black', fontWeight: 'bold'}}>{phone}</p>
                </div>
              </li>
              <li>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p>Ngày sinh</p>
                  <p style={{color: 'black', fontWeight: 'bold'}}>
                  {moment(dateofbirth).format('DD/MM/YYYY')}</p>
                </div>
              </li>
              <li>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p>Địa chỉ</p>
                  <p style={{color: 'black', fontWeight: 'bold'}}>{address}</p>
                </div>
              </li>
            <li>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p>Giới tính</p>
                  <p style={{color: 'black', fontWeight: 'bold'}}>{sex}</p>
                </div>
            </li>
            <li>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p>Khoa</p>
                  <p style={{color: 'black', fontWeight: 'bold'}}>{department}</p>
                </div>
            </li>
            </ul>
          </div>
        </div>
    )
}
export default DoctorCardComponent;
