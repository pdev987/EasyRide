import "../styles/about.css"
import OurMissionImg from "../assets/ourMission.webp"

export default function About() {
  return <div className="about-main-container">
    <div className="about-our-mission-container">
      <div className="about-our-mission-text-container">
        <h1>Our Mission</h1>
        <p>At EasyRide, our mission is to provide seamless
          affordable, and high-quality car rental experiences.
          We believe that the journey is just as important as
          the destination.
        </p>
        <p>
          Our moto is to proide an easy renting car experience
          through our webiste with few click you can choose
          best car for your journey.
        </p>
        <p>
          We are committed to getting you on the road with
          confidence and a smile, removing the friction from
          traditional rental processes and putting you back in
          the driver's seat of your own <span>Adventure.</span>
        </p>
      </div>
      <div className="about-our-mission-image-container">
        <img src={OurMissionImg} alt="our-misssion-image" />
      </div>
    </div>

    <div className="about-main-address-container">
      <div className="about-main-address">
        <h3>Visit Our Main Hub</h3>
        <p>
          We're strategically located near
          major transit hubs to ensure you
          can start your journey immedietly
          upon arrival
        </p>
        <p>123 Dasrahalli, Banglore</p>
        <p>+91 9999999999</p>
        <button>Get Direction</button>
      </div>
    </div>

  </div>
}
