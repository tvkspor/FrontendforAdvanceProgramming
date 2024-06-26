import React, { useState, useEffect } from "react";
import { Layout, Button, Drawer, Menu, Avatar } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { WrapperNav } from "./style";
import logo from "../../assets/images/logo.jpg";
import MenuItem from "antd/lib/menu/MenuItem";

import ButttonInputSearch from "../ButtonInputSearch/ButttonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";

import Loading from "../LoadingComponent/Loading";

import { searchProduct } from "../../redux/slides/productSlide";

import {
  WrapperAccount,
  WrapperHeader,
  WrapperHeaderAccout,
  WrapperTextHeader,
  WrapperDivMenu,
  WrapperTextSmall,
  WrapperPopup,
  ImgContainer,
} from "./style";
import { Badge, Col, Popover } from "antd";
import { CaretDownOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const showDrawer = () => {
    setVisible(!visible);
  };

  const { pathname: location } = useLocation();

  useEffect(() => {
    setVisible(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Gọi hàm ngay lúc ban đầu để xác định isMobile
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const order = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };

  var isHiddenCart = false 
  if (user?.isDoctor || user?.isAdmin) {
    isHiddenCart = true;
  }

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const handleClickNavigate = (type) => {
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "specialist") {
      navigate("/specialist");
    } else if (type === "booking") {
      navigate("/booking");
    } else if (type === "/") {
      navigate("/");
    } else if (type === "doctor") {
      navigate("/doctor");
    } else if (type === "orderitems") {
        navigate("/orderitems");
      
    }
    else if (type === "medicalequipment") {
        navigate("/medicalequipment");
    }
    else if (type === "medicine") {
      navigate("/medicine");
    }
    else if (type === "medicalreport") {
      navigate("/my-medicalrecords",{
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else if (type === "doctorpage") {
      navigate("/my-doctorpage", {
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else if (type === "my-order") {
      navigate("/my-order", {
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else {
      handleLogout();
      navigate("/");
    }
    setIsOpenPopup(false);
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };

  const content = (
    <div>
      <WrapperPopup onClick={() => handleClickNavigate("profile")}>
        Thông tin người dùng
      </WrapperPopup>
      {user?.isAdmin && (
        <WrapperPopup onClick={() => handleClickNavigate("admin")}>
          Quản lí hệ thống
        </WrapperPopup>
      )}
      {user?.isDoctor && (
        <WrapperPopup onClick={() => handleClickNavigate("doctorpage")}>
          Lịch trình làm việc
        </WrapperPopup>
      )}
      {/* {!user?.isDoctor && !user?.isAdmin && (
        <WrapperPopup onClick={() => handleClickNavigate(`my-order`)}>
          Đơn hàng của tôi
        </WrapperPopup>
      )} */}
      {!user?.isDoctor && !user?.isAdmin && (
        <WrapperPopup onClick={() => handleClickNavigate("medicalreport")}>
          Hồ sơ bệnh án
        </WrapperPopup>
      )}
      {!user?.isDoctor && !user?.isAdmin && (
        <WrapperPopup onClick={() => handleClickNavigate("booking")}>
          Đặt khám
        </WrapperPopup>
      )}
      {/* {(user?.isAdmin || user?.isDoctor) && 
      <WrapperPopup onClick={() => handleClickNavigate("medicalequipment")}>Xem thiết bị</WrapperPopup>}
      {(user?.isAdmin || user?.isDoctor) && 
      <WrapperPopup onClick={() => handleClickNavigate("medicine")}>Xem thuốc</WrapperPopup>} */}

      <WrapperPopup onClick={() => handleClickNavigate()}>
        Đăng xuất
      </WrapperPopup>
    </div>
  );

  return (
    <WrapperNav>
      <Layout>
        <Layout.Header className="nav-header">
          <div
            className="logo"
            style={{ cursor: "pointer", fontWeight: "bold", fontSize: "16px",
              marginRight: "20%"
             }}
            onClick={() => handleClickNavigate("/")}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ width: "50px", height: "50px" }}
            />
            Hospital
          </div>

          {isMobile ? (
            <div className="navbar-menu">
              <Button className="menuButton" type="text" onClick={showDrawer}>
                <MenuOutlined />
              </Button>
              <Drawer
                title={"Menu"}
                placement="right"
                closable={true}
                onClose={showDrawer}
                visible={visible}
                style={{ zIndex: 99999 }}
              >
                <Menu mode={"inline"}>
                  <Menu.Item key="home" onClick={() => navigate("/")}>Trang chủ</Menu.Item>
                  <Menu.Item key="specialist" onClick={() => navigate("/specialist")}>Chuyên Khoa</Menu.Item>
                  <Menu.Item key="expert" onClick={() => navigate("/doctor")}>Chuyên gia</Menu.Item>
                  {/* <Menu.Item key="news">Tin tức</Menu.Item> */}
                  {/* <Menu.Item key="book" onClick={() => navigate("/booking")}>Đặt khám</Menu.Item> */}
                  {!isHiddenCart && <Menu.Item key="bill" onClick={() => navigate("/orderitems")}>Liệu trình</Menu.Item>}
                  {/* <Menu.Item key="contact">Liên Hệ</Menu.Item> */}
                  <Menu.Item key="login" onClick={handleNavigateLogin}>
                    <Loading isLoading={loading}>
                      <WrapperAccount>
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="avatar"
                            style={{
                              height: "30px",
                              width: "30px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <UserOutlined style={{ fontSize: "30px" }} />
                        )}
                        {user?.access_token ? (
                          <>
                            <Popover
                              content={content}
                              trigger="click"
                              open={isOpenPopup}
                            >
                              <div
                                style={{
                                  cursor: "pointer",
                                  maxWidth: 100,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                onClick={() => setIsOpenPopup((prev) => !prev)}
                              >
                                {userName?.length ? userName : user?.email}
                              </div>
                            </Popover>
                          </>
                        ) : (
                          <div
                            onClick={handleNavigateLogin}
                            style={{ cursor: "pointer" }}
                          >
                            <WrapperTextSmall></WrapperTextSmall>
                            <div>
                              <WrapperTextSmall>Tài khoản</WrapperTextSmall>
                              <CaretDownOutlined />
                            </div>
                          </div>
                        )}
                      </WrapperAccount>
                    </Loading>{" "}
                  </Menu.Item>
                  {user?.access_token && <Menu.Item key="profile" onClick={() => handleClickNavigate("profile")}>Thông tin người dùng</Menu.Item>}
                  {user?.access_token && !user?.isDoctor && !user?.isAdmin && <Menu.Item key="detail" onClick={() => handleClickNavigate("medicalreport")}>Hồ sơ bệnh án</Menu.Item>}
                  {user?.access_token && !user?.isDoctor && !user?.isAdmin && <Menu.Item key="booking" onClick={() => handleClickNavigate("booking")}>Đặt khám</Menu.Item>}
                  {user?.isDoctor && <Menu.Item key="scheduler" onClick={() => handleClickNavigate("doctorpage")}>Lịch trình làm việc</Menu.Item>}
                  {user?.isAdmin && <Menu.Item key="manage" onClick={() => handleClickNavigate("admin")}>Quản lí hệ thống</Menu.Item>}
                  {(user?.isAdmin || user?.isDoctor) && <Menu.Item key="medicalequipment" onClick={() => handleClickNavigate("medicalequipment")}>Xem thiết bị</Menu.Item>}
                  {(user?.isAdmin || user?.isDoctor) && <Menu.Item key="medicine" onClick={() => handleClickNavigate("medicine")}>Xem thuốc</Menu.Item>}
                  {user?.access_token && <Menu.Item key="logout" onClick={() => handleClickNavigate()}>Đăng xuất</Menu.Item>}

                  {!isHiddenCart &&
                  
                  <MenuItem key="badge"> 
                  <div
                    onClick={() => navigate("/order")}
                    style={{ cursor: "pointer" }}
                  >
                    <Badge count={order?.orderItems?.length} size="small">
                      <ShoppingCartOutlined
                        style={{ fontSize: "30px", color: "#444" }}
                      />
                    </Badge>
                    <WrapperTextSmall>Thanh toán</WrapperTextSmall>
                  </div>
                  </MenuItem>}
                </Menu>
              </Drawer>
            </div>
          ) : (
            <Menu mode="horizontal" className="rightMenu" style={{paddingLeft: "0.1rem"}}>
              <Menu.Item key="home" onClick={() => handleClickNavigate("/")}>
                Trang chủ
              </Menu.Item>
              <Menu.Item
                key="specialist"
                onClick={() => handleClickNavigate("specialist")}
              >
                Chuyên Khoa
              </Menu.Item>
              <Menu.Item
                key="expert"
                onClick={() => handleClickNavigate("doctor")}
              >
                Chuyên gia
              </Menu.Item>
              {(user.isDoctor || user.isAdmin) && <Menu.Item key="medicalequipment" onClick={() => navigate("/medicalequipment")}>Xem thiết bị </Menu.Item>}
              {(user.isDoctor || user.isAdmin) && <Menu.Item key="medicine" onClick={() => navigate("/medicine")}>Xem thuốc </Menu.Item>}

              {/* <Menu.Item key="news">Tin tức</Menu.Item> */}
              {/* {!isHiddenCart &&<Menu.Item
                key="book"
                onClick={() => handleClickNavigate("booking")}
              >
                Đặt khám
              </Menu.Item>} */}
              {!isHiddenCart && <Menu.Item key="bill"
              onClick={() => handleClickNavigate("orderitems")}
              >
                Liệu trình</Menu.Item>}
              {/* <Menu.Item key="contact">Liên Hệ</Menu.Item> */}
              
              <Menu.Item key="login">
                <Loading isLoading={loading}>
                  <WrapperAccount>
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="avatar"
                        style={{
                          height: "30px",
                          width: "30px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <UserOutlined style={{ fontSize: "30px" }} />
                    )}
                    {user?.access_token ? (
                      <>
                        <Popover
                          content={content}
                          trigger="click"
                          open={isOpenPopup}
                        >
                          <div
                            style={{
                              cursor: "pointer",
                              maxWidth: 100,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            onClick={() => setIsOpenPopup((prev) => !prev)}
                          >
                            {userName?.length ? userName : user?.email}
                          </div>
                        </Popover>
                      </>
                    ) : (
                      <div
                        onClick={handleNavigateLogin}
                        style={{ cursor: "pointer" }}
                      >
                        <WrapperTextSmall></WrapperTextSmall>
                        <div>
                          <WrapperTextSmall>Tài khoản</WrapperTextSmall>
                          <CaretDownOutlined />
                        </div>
                      </div>
                    )}
                  </WrapperAccount>
                </Loading>
              </Menu.Item>
              <MenuItem key="badge"> 
              {!isHiddenCart && (
            <div
              onClick={() => navigate("/order")}
              style={{ cursor: "pointer" }}
            >
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "#444" }}
                />
              </Badge>
              <WrapperTextSmall>Thanh toán</WrapperTextSmall>
            </div>
          )}
                  </MenuItem>
            </Menu>
          )}
        </Layout.Header>
      </Layout>
    </WrapperNav>
  );
};

export default Navbar;
