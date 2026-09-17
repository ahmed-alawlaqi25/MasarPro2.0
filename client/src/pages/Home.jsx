import React from 'react'
import Hero from '../components/Hero';
import Feature from '../components/Feature';
import Testimonial from '../components/Testimonial';
import CTA from '../components/CTA';
import Footer from '../components/Footer';


const Home = () => {
    return (
        <>
            <div className='flex flex-col gap-16 bg-[#f4f9fc]'>
                <Hero />
                <Feature/>
                <Testimonial/>
                <CTA/>
                <Footer/>
            </div>
        </>
    )
}

export default Home