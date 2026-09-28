from typing import Dict, Any, List

class BaseExtractor:
    """Abstraction for NLP intent and entity extraction."""
    def extract_profile(self, text: str) -> Dict[str, Any]:
        raise NotImplementedError

class MockExtractor(BaseExtractor):
    """
    Mock implementation for MVP demo.
    Uses simple keyword matching to simulate an LLM extracting entities from Hinglish/Hindi speech.
    """
    def extract_profile(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        
        # Default empty profile
        profile = {
            "education": None,
            "occupation": None,
            "skills": [],
            "interests": [],
            "employmentPreference": None,
            "mobilityKm": None,
            "language": "hi"
        }

        # Mocking semantic extraction based on the demo scenario
        if "electrician" in text_lower or "electrical" in text_lower or "bijli" in text_lower:
            profile["skills"].append({
                "name": "Electrical",
                "level": "Basic",
                "experienceYears": 2 if "do saal" in text_lower or "2" in text_lower else 0
            })
            profile["interests"].append("Electrical")
            profile["occupation"] = "Farming" # Simulated contextual inference

        if "job" in text_lower or "naukri" in text_lower:
            profile["employmentPreference"] = "Wage Employment"
        
        if "apna kaam" in text_lower or "business" in text_lower:
            profile["employmentPreference"] = "Self Employment"

        if "ghar ke paas" in text_lower or "nazdeek" in text_lower:
            profile["mobilityKm"] = 15

        if "dasvi" in text_lower or "10th" in text_lower:
            profile["education"] = "10th"

        return profile

class LLMExtractor(BaseExtractor):
    """
    Production implementation that would call OpenAI/Gemini/etc.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key

    def extract_profile(self, text: str) -> Dict[str, Any]:
        # TODO: Implement actual LLM call with structured output
        pass

def get_extractor() -> BaseExtractor:
    # Use MockExtractor for MVP since we lack API credentials
    return MockExtractor()
