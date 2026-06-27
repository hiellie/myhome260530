# Graph Color Groups


Obsidian 그래프 뷰 컬러 설정. `.obsidian/graph.json`의 `colorGroups`에 적용되어 있다.


---


## 적용된 컬러 그룹


| 그룹 | 쿼리 | 색상 | 해당 파일 |
|------|------|------|-----------|
| 백엔드 | `path:tailor` | 🔵 `#3B82F6` | `tailor/CLAUDE.md`, `apps/*/README.md` 등 |
| 프론트엔드 | `path:taylor` | 🟢 `#22C55E` | `taylor/CLAUDE.md`, `taylor/README.md` 등 |
| DevOps 문서 | `path:vault/DevOps` | 🟠 `#F97316` | `ENTITY_RULE.md`, `TITANIC_ERD.md`, `REACT_RULES.md` |
| 94-wiki | `path:vault/94-wiki` | 🟣 `#8B5CF6` | 투표, agora 노트 |
| 97-wiki | `path:vault/97-wiki` | 🩷 `#EC4899` | `project_context.md`, `nf.md` |
| 볼트 일반 | `path:vault` | 🩵 `#14B8A6` | `환영합니다!.md`, 나머지 노트 |
| 기본 | (미분류) | ⚫ 기본색 | 루트의 `CLAUDE.md`, `agent.md` 등 |


---


## 우선순위 규칙


색상 그룹은 위에서부터 순서대로 적용되며 **먼저 매칭된 그룹이 우선**한다.


- `path:vault/DevOps` → `path:vault/94-wiki` → `path:vault/97-wiki` 순으로 구체적인 경로를 먼저 배치
- `path:vault`는 마지막에 위치해 위 세 그룹에 해당하지 않는 나머지 볼트 파일을 모두 잡는다


---


## 새 그룹 추가 방법


`.obsidian/graph.json`의 `colorGroups` 배열에 아래 형식으로 추가한다.


```json
{
  "query": "path:폴더명",
  "color": {
    "a": 1,
    "rgb": 10진수_RGB값
  }
}
```


RGB 10진수 변환: `R×65536 + G×256 + B`


| 색상 예시 | Hex | rgb (decimal) |
|-----------|-----|---------------|
| 🔵 Blue | `#3B82F6` | `3900150` |
| 🟢 Green | `#22C55E` | `2278750` |
| 🟠 Orange | `#F97316` | `16347926` |
| 🟣 Purple | `#8B5CF6` | `9133302` |
| 🩷 Pink | `#EC4899` | `15485081` |
| 🩵 Teal | `#14B8A6` | `1357990` |
| 🟡 Yellow | `#FBBF24` | `16498468` |
| 🔴 Red | `#EF4444` | `15681604` |
