#!/usr/bin/env python3
from dotenv import load_dotenv
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import os


def main():
    load_dotenv()
    MODEL = os.getenv("MODEL", "gpt-4o-mini")
    SYSTEM = "당신은 친절한 AI 어시스턴트입니다. 모르면 '확인 필요'라고만 답하세요."

    llm = ChatOpenAI(model=MODEL, temperature=0.3)

    messages = []

    print("대화 시작 — 종료하려면 '/quit' 입력")
    while True:
        try:
            user_input = input("You: ")
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if user_input.strip() == "/quit":
            print("종료합니다.")
            break

        messages.append({"role": "user", "content": user_input})

        msgs = [SystemMessage(content=SYSTEM)]
        for m in messages:
            cls = HumanMessage if m["role"] == "user" else AIMessage
            msgs.append(cls(content=m["content"]))

        try:
            resp = llm.invoke(msgs)
            answer = resp.content
        except Exception as e:
            answer = f"[ERROR] {e}"

        print("Assistant:", answer)
        messages.append({"role": "assistant", "content": answer})


if __name__ == "__main__":
    main()
