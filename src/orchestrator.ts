import * as fs from 'fs';
import * as path from 'path';
import { parserAgent, architectAgent, devAgent, qaAgent, reviewerAgent } from './agents';

const OUTPUT_DIR = path.join(__dirname, '../output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Define a structural interface for the log entries
export interface AgentLog {
  agent: string;
  action: string;
  timestamp: string;
}

export async function runRefactorBot(legacyCode: string, targetFramework: string) {
  const logs: AgentLog[] = [];

  // Helper function to track communication
  const recordLog = (agent: string, action: string) => {
    const entry = { agent, action, timestamp: new Date().toLocaleTimeString() };
    logs.push(entry);
    console.log(`[${entry.agent}]: ${entry.action}`); // Keeps logs visible in cloud console too
  };

  recordLog('System', 'Starting RefactorBot Orchestration Loop...');

  recordLog('Parser', 'Analyzing legacy source code structure...');
  const parsedData = await parserAgent(legacyCode);

  recordLog('Architect', `Designing target architecture for framework: ${targetFramework}`);
  const architectPlan = await architectAgent(parsedData, targetFramework);

  recordLog('Developer', 'Drafting initial production-ready code files...');
  let generatedCode = await devAgent(architectPlan, parsedData);

  let approved = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 3;

  while (!approved && attempts < MAX_ATTEMPTS) {
    attempts++;
    recordLog('QA Engineer', `Reviewing code implementation (Attempt ${attempts}/${MAX_ATTEMPTS})...`);
    const qaResult = await qaAgent(generatedCode);
    
    try {
      const qaJson = JSON.parse(qaResult);
      if (qaJson.approved === true) {
        approved = true;
        recordLog('QA Engineer', 'Verification successful. Code approved for production.');
      } else {
        recordLog('QA Engineer', `Code rejected. Feedback: ${qaJson.feedback}`);
        if (attempts < MAX_ATTEMPTS) {
          recordLog('Senior Reviewer', 'Mediating conflicts and generating actionable fix instructions...');
          const reviewFeedback = await reviewerAgent(qaJson.feedback, generatedCode);
          
          recordLog('Developer', 'Rewriting code based on Reviewer and QA adjustments...');
          generatedCode = await devAgent(architectPlan, parsedData + '\n\nFIXES:\n' + reviewFeedback);
        }
      }
    } catch (e) {
      recordLog('System Warning', 'QA response could not be parsed as valid JSON.');
    }
  }

  if (approved) {
    recordLog('System', 'Orchestration complete. Writing finalized assets to disk.');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'generated_code.txt'), generatedCode);
  } else {
    recordLog('System Error', 'Max negotiation cycles reached without complete QA approval.');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'generated_code_last.txt'), generatedCode);
  }

  // Return both the final code AND the collected logs to the caller
  return {
    generatedCode,
    logs
  };
}