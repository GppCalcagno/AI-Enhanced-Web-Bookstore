from openai import OpenAI
import json

from dotenv import load_dotenv

load_dotenv( '.env') # new

client = OpenAI()



def getBookInfo(title,author, comments):
  try:
    completion = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "You are a expert librarian."},
        {"role": "system", "content": "You can only answer filling the following template in JSON format where all the elements are string: { bookinfo: FILL HERE, commentsummary: FILL HERE } avoid all \" \\ \" and \" \\n\ \" "},
        {"role": "user", "content": f"Provide additional information of the book {title} from  {author} and write a short resume of the following comments : {comments}. Base the commentsummary only on these comments. If you don't have any information, write \"No comments \"."}
      ]
    )
    data = json.loads(completion.choices[0].message.content)
    
  except Exception as e:
    print(e)
    return {"bookinfo":"No information available now","commentssummary":"No information available now"}
  
  return data 
