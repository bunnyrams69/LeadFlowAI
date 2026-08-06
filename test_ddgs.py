from duckduckgo_search import DDGS
import json

def test():
    try:
        results = DDGS().text('site:linkedin.com/in "dental clinic"', max_results=10)
        print(json.dumps(results, indent=2))
    except Exception as e:
        print("Error:", e)
        
if __name__ == "__main__":
    test()
