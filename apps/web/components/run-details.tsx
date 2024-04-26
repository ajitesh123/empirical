import { Button } from "./ui/button";
import CodeViewer from "./ui/code-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RunConfig } from "@empiricalrun/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TriangleRightIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";

export const RunDetails = ({
  onClose,
  runConfig,
  onClickRun,
}: {
  onClickRun?: (runConfig: RunConfig) => void;
  onClose?: () => void;
  runConfig: RunConfig;
}) => {
  if (!runConfig) {
    return null;
  }
  const defaultTabValue = runConfig.type === "model" ? "prompt" : "parameters";
  const [runConfigState, setRunConfigState] = useState<RunConfig | undefined>();
  useEffect(() => setRunConfigState(runConfig), [runConfig]);
  const [error, setError] = useState<string | undefined>();
  const updatePrompt = useCallback(
    (prompt: string | undefined = "") => {
      let updatedPrompt = prompt;
      try {
        updatedPrompt = JSON.parse(prompt);
      } catch (error) {
        if (runConfig.type === "model") {
          if (typeof runConfig.prompt === "object") {
            setError("Invalid prompt object");
            return;
          }
        }
      }
      if (runConfigState && runConfigState.type === "model") {
        setError(undefined);
        setRunConfigState({
          ...runConfigState,
          prompt: updatedPrompt,
        });
      }
    },
    [runConfigState],
  );
  const updateParameters = useCallback(
    (parametersStr: string | undefined = "") => {
      if (runConfigState) {
        setRunConfigState({
          ...runConfigState,
          parameters: JSON.parse(parametersStr),
        });
      }
    },
    [runConfigState],
  );
  const onClickRunCallback = useCallback(() => {
    if (onClickRun && runConfigState) {
      onClickRun(runConfigState);
    }
  }, [runConfigState]);

  return (
    <Card className="my-4 rounded-md">
      <CardHeader className="flex flex-row w-full justify-between pb-0">
        <div className="flex flex-col self-center">
          <CardTitle className="flex flex-row space-x-1 items-center">
            <span>{runConfig.name}</span>
          </CardTitle>
        </div>
        <div className="flex flex-row mt-0 gap-2">
          <Button
            variant={"default"}
            size={"sm"}
            className="pl-1"
            onClick={onClickRunCallback}
            disabled={!!error}
          >
            <TriangleRightIcon width={20} height={20} />
            <span>Run</span>
          </Button>
          <Button variant={"outline"} size={"sm"} onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTabValue}>
          <TabsList className="w-fit rounded-sm">
            {runConfig.type === "model" && (
              <TabsTrigger value="prompt" className="text-xs rounded-sm">
                Prompt template
              </TabsTrigger>
            )}
            <TabsTrigger value="parameters" className="text-xs rounded-sm">
              Parameters
            </TabsTrigger>
          </TabsList>
          {runConfig.type === "model" && (
            <TabsContent value="prompt">
              <CodeViewer
                value={
                  typeof runConfig.prompt === "string"
                    ? runConfig.prompt
                    : JSON.stringify(runConfig.prompt || "", null, 2)
                }
                language={
                  typeof runConfig.prompt === "string" ? "prompt" : "json"
                }
                onChange={updatePrompt}
              />
            </TabsContent>
          )}
          <TabsContent value="parameters">
            <CodeViewer
              value={JSON.stringify(runConfig.parameters || "", null, 2)}
              language="json"
              onChange={updateParameters}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
