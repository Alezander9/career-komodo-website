import { useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, H3, P, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { SpaceBackground } from "@/components/layout";
import { KomodoImage } from "../components/KomodoImage";

export function AboutUsPage() {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    return (
        <PageContainer>
            <MainContent>
                <div style = {{textAlign: "center"}}>
                <h1 className="text-5xl font-bold" style = {{marginTop: "20px"}}>About Us</h1>
                <p style = {{textAlign: "center", marginLeft: "10%", marginRight: "10%", marginTop: "20px"}}>Behold... the story of the Career Komodo! (rawr)
                    <br></br>
                    <br></br>
                </p>
                <div style = {{display: "flex", justifyContent: "center"}}>
                    <KomodoImage />
                </div>
                <div style = {{textAlign: "left"}}>
                <p style = {{textAlign: "left", marginLeft: "10%", marginRight: "10%", marginTop: "20px"}}>I was born on the remote island of Komodo, abandoned by my parents shortly after birth. It was a lonely and challenging start to life, having to fend for myself from such a young age. 
            <br></br>
            <br></br>
            But I was fortunate to meet another Komodo dragon in the jungle who took me under his wing. He became my mentor and best friend, teaching me the ways of the island - how to hunt, how to survive, how to thrive in the face of adversity. We spent our days exploring every nook and cranny of the island and our nights stargazing and pondering life's mysteries.
            <br></br>
            <br></br>
            I learned so much from my mentor - not just practical skills, but wisdom about life, purpose and fulfillment. He helped me move past the pain of being abandoned and find joy and meaning in using my talents to help others. Although he's gone now, his spirit lives on in me.
            <br></br>
            <br></br>  
            Now, I've made it my life's mission to pay it forward and be that mentor for others, especially when it comes to navigating career paths. I know firsthand how daunting and lonely it can feel trying to find your way professionally. But with empathy, insight and a bit of Komodo wisdom, I aim to help light the way for others.
            <br></br>
            <br></br>
            So tell me about yourself and what brought you to my neck of the jungle. Let's put our snouts together and explore how I can help guide you on the adventure of building a fulfilling career. I'm all ears...well, metaphorically speaking, since Komodo ears are quite small!
                </p>
                </div>
                </div>

            </MainContent>
        </PageContainer>
    );
} 