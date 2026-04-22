# Agents Configuration

## Agent Rules
- Use `pnpm` as package manager
- Follow RTL-first design (Law #5)  
- Use Biome for linting, not ESLint
- TypeScript strict mode, zero `any`
- Max 150 lines per file, 30 lines per function
- All tests must pass before claiming done

## Agent Capabilities
- **Codex**: Tests, security audits, code review
- **MiniMax**: Schema, CRUD, lib code (dirty prototype — always typecheck)
- **Kimi**: UI components, pages
- **Gemini**: Analysis, research, architecture

## References
- CLAUDE.md for full rules
- ~/.claude/rules/ for quality/security rules

