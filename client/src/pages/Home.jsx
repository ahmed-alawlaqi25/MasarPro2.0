import React from 'react'
import Hero from '../components/Hero';
import Feature from '../components/Feature';
import Testimonial from '../components/Testimonial';
import CTA from '../components/CTA';
import Footer from '../components/Footer';


const Home = () => {
    return (
        <>
            <div className='relative flex flex-col gap-16 overflow-hidden bg-[#f4f9fc]'>  
                <Hero />
                <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#0fc2b3]/15 blur-[120px]" />
                
                <Feature/>
                
                <Testimonial/>
                <div className="pointer-events-none absolute -right-40 top-[35%] h-[500px] w-[500px] rounded-full bg-[#114f83]/10 blur-[130px]" />
                <CTA/>
                
                <Footer/>
            </div>
        </>
    )
}

export default Home