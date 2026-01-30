import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Edit2, Check, X, Sparkles } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useComboAIRules,
  useCreateComboAIRule,
  useUpdateComboAIRule,
  useDeleteComboAIRule,
} from "@/hooks/useComboAIRules";
import { useComboPackages } from "@/hooks/useComboPackages";

const ruleFormSchema = z.object({
  rule_name: z.string().min(1, "Rule name is required"),
  combo_id: z.string().min(1, "Combo package is required"),
  priority: z.coerce.number().min(1).max(100),
  max_discount_percent: z.coerce.number().min(0).max(100).optional(),
  is_active: z.boolean(),
  trip_days_min: z.coerce.number().min(0).optional(),
  trip_days_max: z.coerce.number().min(0).optional(),
  budget_tier: z.string().optional(),
  travel_style: z.string().optional(),
  has_children: z.boolean().optional(),
});

type RuleFormValues = z.infer<typeof ruleFormSchema>;

const ComboAIRules = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: rules, isLoading: rulesLoading } = useComboAIRules();
  const { data: combos, isLoading: combosLoading } = useComboPackages({ activeOnly: false });
  const createRule = useCreateComboAIRule();
  const updateRule = useUpdateComboAIRule();
  const deleteRule = useDeleteComboAIRule();

  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      rule_name: "",
      combo_id: "",
      priority: 50,
      max_discount_percent: undefined,
      is_active: true,
      trip_days_min: undefined,
      trip_days_max: undefined,
      budget_tier: "",
      travel_style: "",
      has_children: undefined,
    },
  });

  const handleOpenCreate = () => {
    form.reset({
      rule_name: "",
      combo_id: "",
      priority: 50,
      max_discount_percent: undefined,
      is_active: true,
      trip_days_min: undefined,
      trip_days_max: undefined,
      budget_tier: "",
      travel_style: "",
      has_children: undefined,
    });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (rule: NonNullable<typeof rules>[0]) => {
    const conditions = rule.conditions as Record<string, unknown>;
    form.reset({
      rule_name: rule.rule_name,
      combo_id: rule.combo_id,
      priority: rule.priority,
      max_discount_percent: rule.max_discount_percent ?? undefined,
      is_active: rule.is_active ?? true,
      trip_days_min: (conditions?.trip_days_min as number) ?? undefined,
      trip_days_max: (conditions?.trip_days_max as number) ?? undefined,
      budget_tier: (conditions?.budget_tier as string) ?? "",
      travel_style: (conditions?.travel_style as string) ?? "",
      has_children: conditions?.has_children === true ? true : undefined,
    });
    setEditingId(rule.id);
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: RuleFormValues) => {
    const conditions: Record<string, unknown> = {};
    
    if (values.trip_days_min !== undefined && values.trip_days_min > 0) {
      conditions.trip_days_min = values.trip_days_min;
    }
    if (values.trip_days_max !== undefined && values.trip_days_max > 0) {
      conditions.trip_days_max = values.trip_days_max;
    }
    if (values.budget_tier && values.budget_tier !== "") {
      conditions.budget_tier = values.budget_tier;
    }
    if (values.travel_style && values.travel_style !== "") {
      conditions.travel_style = values.travel_style;
    }
    if (values.has_children === true) {
      conditions.has_children = true;
    }

    const payload = {
      rule_name: values.rule_name,
      combo_id: values.combo_id,
      priority: values.priority,
      max_discount_percent: values.max_discount_percent ?? null,
      is_active: values.is_active,
      conditions,
    };

    if (editingId) {
      await updateRule.mutateAsync({ id: editingId, ...payload });
    } else {
      await createRule.mutateAsync(payload);
    }
    
    setIsDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      await deleteRule.mutateAsync(id);
    }
  };

  const getComboName = (comboId: string) => {
    return combos?.find((c) => c.id === comboId)?.name ?? "Unknown";
  };

  const formatConditions = (conditions: unknown) => {
    const cond = conditions as Record<string, unknown>;
    if (!cond || Object.keys(cond).length === 0) return "No conditions";
    
    const parts: string[] = [];
    if (cond.trip_days_min) parts.push(`days ≥ ${cond.trip_days_min}`);
    if (cond.trip_days_max) parts.push(`days ≤ ${cond.trip_days_max}`);
    if (cond.budget_tier) parts.push(`budget = ${cond.budget_tier}`);
    if (cond.travel_style) parts.push(`style = ${cond.travel_style}`);
    if (cond.has_children) parts.push("has children");
    
    return parts.length > 0 ? parts.join(", ") : "No conditions";
  };

  const isLoading = rulesLoading || combosLoading;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-secondary" />
            Combo AI Rules
          </h1>
          <p className="text-muted-foreground">
            Configure rules to suggest combo packages based on traveler preferences
          </p>
        </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              AI Suggestion Rules
            </CardTitle>
            <CardDescription>
              Configure rules to suggest combo packages based on traveler preferences
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Rule" : "Create Rule"}</DialogTitle>
                <DialogDescription>
                  Define conditions to match travelers with combo packages
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="rule_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rule Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Family with Kids" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="combo_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Combo Package</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select combo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {combos?.map((combo) => (
                                <SelectItem key={combo.id} value={combo.id}>
                                  {combo.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Conditions</Label>
                    <div className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg bg-muted/30">
                      <FormField
                        control={form.control}
                        name="trip_days_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Minimum Trip Days</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} placeholder="e.g., 3" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="trip_days_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Maximum Trip Days</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} placeholder="e.g., 5" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget_tier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Budget Tier</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any budget" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="luxury">Luxury</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="travel_style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Travel Style</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Any style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">Any</SelectItem>
                                <SelectItem value="family">Family</SelectItem>
                                <SelectItem value="couple">Couple</SelectItem>
                                <SelectItem value="adventure">Adventure</SelectItem>
                                <SelectItem value="relax">Relax</SelectItem>
                                <SelectItem value="luxury">Luxury</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="has_children"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3 space-y-0 md:col-span-2">
                            <FormControl>
                              <Switch
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-xs">Has Children in Party</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority (1-100)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={100} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="max_discount_percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Discount %</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} max={100} placeholder="Optional" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3 space-y-0 pt-8">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>Active</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createRule.isPending || updateRule.isPending}>
                      {editingId ? "Update Rule" : "Create Rule"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !rules?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No AI rules configured yet</p>
              <p className="text-sm">Create your first rule to start suggesting combos</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Target Combo</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.rule_name}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatConditions(rule.conditions)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getComboName(rule.combo_id)}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{rule.priority}</TableCell>
                    <TableCell className="text-center">
                      {rule.is_active ? (
                        <Badge className="bg-emerald-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(rule)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
};

export default ComboAIRules;
