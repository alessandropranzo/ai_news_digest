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

text = """
# AI Startup Scene Newsletter Digest - May 23, 2025


Welcome to your daily digest of the latest happenings in the AI startup ecosystem. Below, you'll find the most recent updates from yesterday, May 23, 2025, organized into key sections for quick reading. Let's dive into the innovations, trends, and standout companies shaping the future of artificial intelligence.

---

## 1. Top Headlines

- **Google I/O 2025 Showcases Major AI Upgrades**  
  At Google's annual developer conference, significant AI advancements were unveiled, focusing on real-world applications. Highlights include Project Mariner, an AI agent prototype capable of managing multiple tasks concurrently, signaling a push towards more practical, scalable AI solutions for businesses and consumers. (Source: Posts found on X; Google Blog)

- **OpenAI and Others Compete for Top AI Talent**  
  The race for AI dominance intensifies as OpenAI, Google, and xAI are reportedly offering millions to attract superstar researchers. This talent war underscores the critical role of human expertise in driving AI innovation, with implications for startup growth and competition. (Source: Reuters)

- **Microsoft and Google Highlight Divergent AI Strategies at Conferences**  
  While Google focuses on consumer-facing AI at I/O, Microsoft's Build conference emphasized enterprise solutions. This split in focus reveals how major tech players are shaping the market, potentially influencing AI startups to align with either consumer or business-oriented innovations. (Source: Fortune)

---

## 2. Industry Trends

- **Shift from Chatbots to Agent Swarms**  
  Enterprise buyers are increasingly seeking large language models (LLMs) that can handle multistep business processes autonomously. Tools like LangGraph 0.6, with state-aware orchestration, and OpenAI's Responses API, billed as a "truly agentic" solution, reflect a trend towards more independent AI systems. (Source: Posts found on X)

- **China's AI Push Goes Global**  
  China's AI sector made waves with ByteDance's PIPPIT AI powering 30% of global SMB ads and the launch of the country's first industrial LLM for international markets. This signals a growing influence of Chinese AI technologies in the global startup landscape. (Source: Posts found on X)

- **AI Model Updates Dominate the Week**  
  Alongside Google and Microsoft's conference announcements, Anthropic's updates to Claude and OpenAI's GPT-4o rollout highlight a week of rapid advancements in AI models. These updates are setting new benchmarks for startups to innovate or integrate cutting-edge tech. (Source: Posts found on X)

---

## 3. Notable Startups

- **ByteDance's CapCut AI Gains Traction**  
  ByteDance reported that its CapCut AI tool surpassed 1 million business users in Q1 2025, with new features like "AI Jingles" for viral audio content. This growth positions ByteDance as a key player in AI-driven creative tools for small businesses. (Source: Posts found on X)

- **DeepSeek-V3 Innovates Cost-Effective Training**  
  Emerging from Peking University's new AI research platform, Science Navigator, DeepSeek-V3 introduces a cost-effective method for training large models. This could lower barriers for smaller AI startups to develop competitive technologies. (Source: Posts found on X)

- **Anthropic's AI Agent Makes Coding Strides**  
  Anthropic's latest AI agent has demonstrated the ability to code for nearly 7 hours autonomously, a development that could inspire startups to focus on specialized, high-endurance AI applications for technical industries. (Source: Posts found on X)

---

*Note: Some information in this digest is sourced from posts found on X and may require further verification for accuracy. For the latest and most comprehensive updates, refer to official announcements and trusted news outlets.*

Thank you for reading today's AI Startup Scene Newsletter Digest. Stay tuned for tomorrow's edition as we continue to track the fast-evolving world of AI innovation!
"""


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
    result = create_podcast(text)
    print("Podcast generated!")