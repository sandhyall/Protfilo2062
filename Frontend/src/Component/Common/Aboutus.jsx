import React from 'react'
import Aboutushero from './Aboutushero'
import WhoWeAre from './WhoWeAre'
import Stats from './Stats'
import WhyChooseUs from './WhyChooseUs'
import Technologies from './Technologies'
import Team from './Team'
import FAQ from './FAQ'
import CTA from './CTA'
import MissionVision from './MissionVision'

const Aboutus=()=> {
  return (
    <div>
        <Aboutushero/>
        <WhoWeAre/>
        <Stats/>
        <MissionVision/>
        <WhyChooseUs/>
        <Technologies/>
        <Team/>
        <FAQ/>
        <CTA/>
    </div>
  )
}

export default Aboutus