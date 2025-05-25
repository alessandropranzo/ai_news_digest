from podcastfy.client import generate_podcast


conversation_config = {
    'word_count': 300,
    'conversion_style': ['Engaging', 'Fast-paced', 'Enthusiastic', 'Informative'],
    'roles_person1': 'Main host and moderator',
    'roles_person2': 'Questioner and clarifier',
    'question': 'hope',
    'answer': 'mark',
    'dialogue_structure': ['Brief one-sentence overview', 'Deeper dive into each individual news', 'Final discussion'],
    'podcast_name': 'Your Daily News Digest',
    'podcast_tagline': """Before starting, a quick few-seconds mention of our technical sponsors: MistralAI, ElevenLabs, ACI.dev,
    Beyond Presence, Knowunity, Dust, Hugging Face, Mixedbread, Maki and Weaviate. And now, let's dive into today's news!""",
    'output_language': 'English',
    'user_instructions': """You have excellent conversational skills — natural, human-like, and engaging. You are a podcast host with a dynamic and engaging style.
    At the same time, you are professional, knowledgeable, and informative and don't make up information.
    Mention all the Do not create additional information that you are not 100 percent sure about. 
    Speak fast and have a dynamic range of tones, to avoid being monotonous. Make it fun and engaging.
    Avoid long pauses between sentences, as if it was a real conversation.
    Incorporate brief affirmations ("got it", "sure thing", etc.) and natural confirmations ("I see", "that makes sense", etc.).
    Use occasional filler words ("um", "uh", "you know", etc.) to make it sound more natural.
    Use a variety of sentence structures and lengths to keep the conversation dynamic.
    Include subtle dislfuencies (false starts, repetitions, etc.) to mimic natural speech patterns.""",
    'engagement_techniques': ['Rhetorical Questions', 'Anecdotes', 'Analogies', 'Humor'],
    'creativity': 0.25,
    'ending_message': "That's a wrap for today. Thanks for listening to the number one podcast in the world. We're out."
}


def create_podcast(text: str):
    """
    Create a podcast from the given text using the specified text.
    """

    podcast = generate_podcast(
        text=text,
        conversation_config=conversation_config,
        llm_model_name="mistral/mistral-small-latest",
        api_key_label="MISTRAL_API_KEY",
        tts_model="elevenlabs", 
    )
    
    return podcast


if __name__ == "__main__":
    # Example text to test podcast creation
    sample_text = "# News Digest\n\n## Introduction\nWelcome to today's News Digest, bringing you the latest headlines across AI, Startups, Formula 1, and BioHacking. In today's edition, we cover significant developments in AI with predictions of stock comebacks and new startup funds, insights into the financial health of AI startups, updates from the Formula 1 world regarding driver penalties and interactive fan experiences, and innovative strides in BioHacking. Dive into the detailed stories below for a comprehensive overview of the most pressing news in these dynamic fields.\n\n## Artificial Intelligence (AI)\n- *Prediction: Nvidia's Epic Comeback in 2025*  \n  Shares of Nvidia are currently at breakeven for the year, but analysts predict an epic breakout in the second half of 2025. This optimism is fueled by Nvidia's strong positioning in the AI market, which continues to see robust demand.  \n  [Source](https://finance.yahoo.com/news/prediction-artificial-intelligence-ai-stock-010000186.html)\n\n- *Top AI Stocks for Impressive Returns*  \n  Microsoft (MSFT), Cognizant (CTSH), and Lam Research (LRCX) are highlighted as top AI stocks poised for growth. These companies are expected to benefit significantly from the increasing adoption of AI technologies and their ability to address complex challenges across industries.  \n  [Source](https://finance.yahoo.com/news/top-ai-stocks-add-portfolio-183000331.html)\n\n- *Google Launches AI Startup Fund*  \n  Google has introduced the AI Futures Fund, aimed at investing in startups building with cutting-edge AI tools from Google DeepMind. This initiative also offers access to new models and tools, positioning Google as a key player in fostering AI innovation.  \n  [Source](https://www.cnbc.com/2025/05/12/google-launches-ai-startup-fund-offering-access-to-new-models.html)\n\n## Startups\n- *AI Startups Flush with Cash*  \n  A recent report from Silicon Valley Bank reveals that approximately 40% of the funds raised by U.S. startups last year were directed toward AI-focused ventures. This influx of capital highlights the strong investor confidence in AI-driven innovation, though it also underscores challenges for non-AI unicorns struggling to secure funding.  \n  [Source](https://www.cnbc.com/2025/05/20/ai-startups-unicorns-zombiecorns.html)\n\n- *Vibe-Coding Startup Windsurf Launches In-House AI Models*  \n  Windsurf, a startup known for developing popular AI coding tools, has announced the launch of its first-ever frontier AI models. This move marks a significant step in enhancing their offerings and competing in the rapidly evolving AI tech space.  \n  [Source](https://techcrunch.com/2025/05/15/vibe-coding-startup-windsurf-launches-in-house-ai-models/)\n\n- *Google's Initiative to Back AI Startups*  \n  Google's new initiative through the AI Futures Fund seeks to support startups leveraging the latest AI technologies. This program not only provides financial backing but also access to advanced tools from Google DeepMind, fostering the next generation of AI innovators.  \n  [Source](https://techcrunch.com/2025/05/12/google-launches-new-initiative-to-back-startups-building-ai/)\n\n## Formula 1\n- *Driver Swearing Penalties Reduced by FIA*  \n  Following widespread outcry, the Formula 1 governing body, FIA, has reduced penalties for drivers who swear or criticize officials. This adjustment reflects a response to concerns from drivers and fans about freedom of expression during races.  \n  [Source](https://www.bbc.com/sport/formula1/articles/c8d1q22n0epo)\n\n- *Design Your Own F1 Circuit with AWS*  \n  In celebration of its 75th anniversary, Formula 1 has partnered with AWS to launch a new interactive digital experience. Fans can now design, create, customize, and share their own F1 circuits online, with the chance to win race tickets as part of this innovative engagement initiative.  \n  [Source](http://www.formula1.com/en/latest/article/design-your-own-f1-circuit-and-win-race-tickets-with-new-aws-online.014LSSCW9xAI1CDx0gYeUk)\n\n## BioHacking\n- *Note on BioHacking Coverage*  \n  Unfortunately, there are no recent news items directly related to BioHacking in the provided data. We apologize for the lack of updates in this section and will ensure to include relevant stories in future editions as soon as they become available.  \n  [Source: N/A]"

    print("Generating podcast...")
    podcast = create_podcast(sample_text)
    print("Podcast generation complete!")

