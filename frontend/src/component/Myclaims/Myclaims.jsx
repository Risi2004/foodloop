import React from "react";
import { useNavigate } from "react-router-dom";
import "./Myclaims.css";
import foodImage from "../../assets/img.png";
import organicFoodIcon from "../../assets/Organic Food.svg";
import checkCircleIcon from "../../assets/check_circle.svg";

const Myclaims = () => {
  const navigate = useNavigate();

  const handleFollowMapClick = () => {
    navigate("/track");
  };

   const handleCreateReceiptClick = () => {
    navigate("/receipt");
  };

  return (
    <div className="myclaims-container">
      <div className="intransit">
        <h2 className="active-donations">In Transit Donation </h2>
        <div className="donation-cards">
          <div className="donation-card">
            <div className="top">
              <div className="div-flex">
                <div className="span-bg-blue-100">
                  <div className="span-size-1-5"></div>
                  <div className="in-transit">In Transit</div>
                </div>
              </div>
              <div className="tool">
                <div className="edit" onClick={handleFollowMapClick}>
                  <img className="swap" src="/src/assets/Swap.svg" alt="Follow map" />
                  <div className="supplied">Follow Map</div>
                </div>
              </div>
            </div>
            <div className="fed">
              <img className="img" src={foodImage} alt="Avocado Toast" />
              <div className="detail">
                <div className="name">
                  <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                  <div className="listed-2-mins-ago">Claimed by Driver #402</div>
                </div>
                <div className="wight">
                  <div className="wight2">
                    <img
                      className="organic-food"
                      src={organicFoodIcon}
                      alt="Organic food"
                    />
                    <div className="_5-kg-available">
                      <span>
                        <span className="_5-kg-available-span">6pcs</span>
                        <span className="_5-kg-available-span2">Available</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="donation-card">
            <div className="top">
              <div className="div-flex">
                <div className="span-bg-blue-100">
                  <div className="span-size-1-5"></div>
                  <div className="in-transit">In Transit</div>
                </div>
              </div>
              <div className="tool">
                <div className="edit" onClick={handleFollowMapClick}>
                  <img className="swap" src="/src/assets/Swap.svg" alt="Follow map" />
                  <div className="supplied">Follow Map</div>
                </div>
              </div>
            </div>
            <div className="fed">
              <img className="img" src={foodImage} alt="Avocado Toast" />
              <div className="detail">
                <div className="name">
                  <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                  <div className="listed-2-mins-ago">Claimed by Driver #402</div>
                </div>
                <div className="wight">
                  <div className="wight2">
                    <img
                      className="organic-food"
                      src={organicFoodIcon}
                      alt="Organic food"
                    />
                    <div className="_5-kg-available">
                      <span>
                        <span className="_5-kg-available-span">6pcs</span>
                        <span className="_5-kg-available-span2">Available</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="looking">
        <h2 className="active-donations">Looking for Driver </h2>
        <div className="donation-cards">
          <div className="donation-card">
            <div className="top">
              <div className="div-flex">
                <div className="span-bg-orange-100">
                  <div className="span-size-1-5-orange"></div>
                  <div className="in-transit-orange">Looking for Driver</div>
                </div>
              </div>
            </div>
            <div className="fed">
              <img className="img" src={foodImage} alt="Avocado Toast" />
              <div className="detail">
                <div className="name">
                  <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                   <div class="listed-2-mins-ago">Listed 2 mins ago</div>
    <div class="listed-2-mins-ago">EXP: 08/2026</div>
                </div>
                <div className="wight">
                  <div className="wight2">
                    <img
                      className="organic-food"
                      src={organicFoodIcon}
                      alt="Organic food"
                    />
                    <div className="_5-kg-available">
                      <span>
                        <span className="_5-kg-available-span">6pcs</span>
                        <span className="_5-kg-available-span2">Available</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="donation-card">
            <div className="top">
              <div className="div-flex">
                <div className="span-bg-orange-100">
                  <div className="span-size-1-5-orange"></div>
                  <div className="in-transit-orange">Looking for Driver</div>
                </div>
              </div>
            </div>
            <div className="fed">
              <img className="img" src={foodImage} alt="Avocado Toast" />
              <div className="detail">
                <div className="name">
                  <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                   <div class="listed-2-mins-ago">Listed 2 mins ago</div>
    <div class="listed-2-mins-ago">EXP: 08/2026</div>
                </div>
                <div className="wight">
                  <div className="wight2">
                    <img
                      className="organic-food"
                      src={organicFoodIcon}
                      alt="Organic food"
                    />
                    <div className="_5-kg-available">
                      <span>
                        <span className="_5-kg-available-span">6pcs</span>
                        <span className="_5-kg-available-span2">Available</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="donation-card">
            <div className="top">
              <div className="div-flex">
                <div className="span-bg-orange-100">
                  <div className="span-size-1-5-orange"></div>
                  <div className="in-transit-orange">Looking for Driver</div>
                </div>
              </div>
            </div>
            <div className="fed">
              <img className="img" src={foodImage} alt="Avocado Toast" />
              <div className="detail">
                <div className="name">
                  <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                   <div class="listed-2-mins-ago">Listed 2 mins ago</div>
    <div class="listed-2-mins-ago">EXP: 08/2026</div>
                </div>
                <div className="wight">
                  <div className="wight2">
                    <img
                      className="organic-food"
                      src={organicFoodIcon}
                      alt="Organic food"
                    />
                    <div className="_5-kg-available">
                      <span>
                        <span className="_5-kg-available-span">6pcs</span>
                        <span className="_5-kg-available-span2">Available</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </div>
      <div className="complited">
        <h2 className="active-donations" style={{ color: "darkgreen" }}>Completed History </h2>
        <div className="donation-cards">
          <div className="donation-card">
            <div className="top">
              <div className="div-flex">
                <div className="span-bg-emerald-100">
                  <img
                    className="check-circle"
                    src={checkCircleIcon}
                    alt="Supplied"
                  />
                  <div className="supplied">Supplied</div>
                </div>
              </div>
              <div className="tool">
                <div className="edit" onClick={handleCreateReceiptClick}>
                  <img
                    className="receipt"
                    src="/src/assets/Receipt.svg"
                    alt="Create receipt"
                  />
                  <div className="supplied2">Create Receipt</div>
                </div>
              </div>
            </div>
            <div className="fed">
              <img className="img" src={foodImage} alt="Avocado Toast" />
              <div className="detail">
                <div className="name">
                  <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                  <div className="listed-2-mins-ago">Delevered by Driver #402</div>
                </div>
                <div className="wight">
                  <div className="wight2">
                    <img
                      className="organic-food"
                      src={organicFoodIcon}
                      alt="Organic food"
                    />
                    <div className="_5-kg-available">
                      <span>
                        <span className="_5-kg-available-span">6pcs</span>
                        <span className="_5-kg-available-span2">Available</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="donation-card">
            <div className="top">
              <div className="div-flex">
                <div className="span-bg-emerald-100">
                  <img
                    className="check-circle"
                    src={checkCircleIcon}
                    alt="Supplied"
                  />
                  <div className="supplied">Supplied</div>
                </div>
              </div>
              <div className="tool">
                <div className="edit" onClick={handleCreateReceiptClick}>
                  <img
                    className="receipt"
                    src="/src/assets/Receipt.svg"
                    alt="Create receipt"
                  />
                  <div className="supplied2">Create Receipt</div>
                </div>
              </div>
            </div>
            <div className="fed">
              <img className="img" src={foodImage} alt="Avocado Toast" />
              <div className="detail">
                <div className="name">
                  <div className="bag-of-fuji-apples">Avocado Toast (6pcs)</div>
                  <div className="listed-2-mins-ago">Delevered by Driver #402</div>
                </div>
                <div className="wight">
                  <div className="wight2">
                    <img
                      className="organic-food"
                      src={organicFoodIcon}
                      alt="Organic food"
                    />
                    <div className="_5-kg-available">
                      <span>
                        <span className="_5-kg-available-span">6pcs</span>
                        <span className="_5-kg-available-span2">Available</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Myclaims;


